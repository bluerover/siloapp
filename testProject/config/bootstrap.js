/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {
  sails.project_path = "/" + __dirname.substring(1, __dirname.lastIndexOf('/'));
  sails.handheld_data_path = process.env.HANDHELD_DATA_PATH || "/Users/andrew/Downloads/test_files";

  sails.custom_helpers = {};
  sails.custom_helpers.render_widget = function(widget) {
    var ejs = require('ejs');
    var fs = require('fs');
    var file = fs.readFileSync(sails.project_path + "/views/dashboard/widgets/" + widget.widget.template_filename).toString();
    var rendered = ejs.render(file, { locals: {widget: widget} });
    return rendered;
  };

  sails.socket_listeners = {};
  sails.notification_handlers = {};
  sails.recent_alerts = {};
  sails.recent_rfid_data = {};

  createEventEmitters();
  setupTickEvent();
  setupBlueRoverApi();
  setupEventListeners();
  setupHandheldDataParser();
  loadRecentAlerts();
  loadRecentRfidData();

  // DO NOT REMOVE! Without calling this callback, you will block the entire server
  cb();
};

function createEventEmitters() {
  var events = require('events');
  sails.event_emitter = new events.EventEmitter();
  sails.alert_emitter = new events.EventEmitter();

  sails.event_emitter.setMaxListeners(0);
  sails.alert_emitter.setMaxListeners(0);
}

function setupTickEvent() {
  var tick = function() {
    sails.event_emitter.emit('tick', new Date().getTime());
    setTimeout(tick, 10000);
  };
  tick();
}

function setupBlueRoverApi() {
  var bluerover = require('node-bluerover');

  bluerover.setCredentials({
    key: "5csNQ8XP38XubTI7oaWPhopjRMROYxwqyBstSmCkU7/3Mek2ej8pLIxj6hQVTQgd",
    token: "AQm6EiXPCfJAg84T/2tcUr2CDRGOzhtDBK/T9GE6",
    baseUrl: "http://developers.polairus.com"});

    var streamBuffer = "";
    // Open the BlueRover API stream
    bluerover.stream(function(e) {
        // Emit raw API data
        sails.event_emitter.emit('raw_data', e);

        // This is an empty buffer from the API
        var emptyBuffer = new Buffer([13, 10]);
        var str = e.toString();

        // If the data isn't empty, parse it and emit the object
        if (str !== emptyBuffer.toString()) {
            try {
                str = streamBuffer + str;
                while (str.indexOf('}') != -1) {
                    var json = str.substring(0, str.indexOf('}') + 1);
                    //console.log("Extracted JSON: " + json)
                    str = str.substring(str.indexOf('}') + 1);
                    //sails.log.debug(JSON.parse(json));
                    sails.log.info("Retrieved and parsed Stream API data");
                    sails.event_emitter.emit('parsed_data', JSON.parse(json));
                }

                streamBuffer = str;
                //console.log("Remaining string in buffer: " + streamBuffer);
            }
            catch(e) {
                sails.log.error("Could not parse JSON: " + e.toString());
                sails.log.info("Error...clearing the stream buffer");
                streamBuffer = "";
            }
        }
    });
}

function setupEventListeners() {
  var circBuffer = require('../helpers/CircularBuffer');
  var util = require('util');

  // This listener takes the parsed data and broadcasts on the rfid-* channel
  sails.event_emitter.on('parsed_data', function(data) {
    // This is to cache the last 20 events for each rfid in memory (right now we just load it from the DB)
    // if (!(data['rfidTagNum'] in sails.rfid_history)) {
    //     sails.rfid_history[data['rfidTagNum']] = new circBuffer(20);
    // }

    // sails.rfid_history[data['rfidTagNum']].push(data);

    sails.event_emitter.emit('rfid-' + data['rfidTagNum'], data);
  });

  // Save parsed data to database
  sails.event_emitter.on('parsed_data', function(data) {
    sails.log.debug("Attempting to write rfid data to database: " + data.rfidTagNum);
    RfidData.create(data).done(function (err, rfid_data) {
      if (err) { sails.log.error("Error saving RFID data to database: " + util.inspect(err)); }
      else { sails.log.info("Wrote new RFID data to database: " + rfid_data.rfidTagNum); }
    });
  });

  // Save parsed data to recent rfid data if the type is rfid
  sails.event_emitter.on('parsed_data', function (data) {
    if (typeof(data.rfidTagNum) !== 'undefined' && data.rfidTagNum !== null) {
      sails.recent_rfid_data[data.rfidTagNum] = data;
    }
  });

  // Run alert handlers on data
  sails.event_emitter.on('parsed_data', function (data) {
    if (typeof(data.rfidTagNum) === 'undefined' || data.rfidTagNum === null) {
      return;
    }

    var tag_id = 'rfid-' + data.rfidTagNum;
    if (tag_id in sails.notification_handlers) {
      sails.log.debug("Running alert handler for " + tag_id);
      for (var handler in sails.notification_handlers[tag_id]) {
        try {
          sails.notification_handlers[tag_id][handler].on('data', data);
        }
        catch (e) {
          sails.log.error("There was a problem executing the alert handler for " + tag_id + ": " + e);
        }
      }
    }
    else {
      sails.log.debug("No active alert handlers found for " + tag_id);
      initializeAlertHandler(tag_id, data);
    }
  });
}

function initializeAlertHandler(tag_id, parsed_data, resume_data) {
  var parsed_rfid = tag_id.substring(5);
  sails.log.debug("Attempting to find alerthandler from database");
  RfidAlerthandler.find({rfid: parsed_rfid}).done(function (err, alerthandler_data) {
    if (err) { sails.log.error("There was a problem finding the alerthandlers for an rfid: " + err); return; }

    sails.log.info("alerthandler found!");

    if (alerthandler_data === undefined || alerthandler_data === null || alerthandler_data.length === 0) {
      return;
    }

    sails.notification_handlers[tag_id] = [];
    for (var index in alerthandler_data) {
      var alerthandler_filename = alerthandler_data[index].alerthandler_name;

      // This is to prevent alert handlers from hijacking the real event bus
      var mock_event_bus = {
        rfid: parsed_rfid,
        emit: function(channel, data) {
          var ms_timestamp = new Date().getTime();
          data.timestamp = Math.round(ms_timestamp / 1000);
          data.alerthandler_name = alerthandler_filename;
          data.rfidTagNum = this.rfid;
          sails.alert_emitter.emit(tag_id, data);
          sails.recent_alerts[this.rfid] = data;
          sails.log.debug("Attempting to write alert to database");
          AlertData.create(data).done(function (err, d) {
            if (err) sails.log.error("AlertData was not saved successfully: " + err);
            sails.log.info("Wrote alert to database");
          });
        }
      };

      var resume = null;
      if (resume_data !== undefined && resume_data !== null && resume_data.alerthandler_name === alerthandler_filename) {
        resume = resume_data;
      }
      var config = JSON.parse(alerthandler_data[index].config);
      var alerthandler_module = require('../alerthandlers/' + alerthandler_filename + ".js");
      var alerthandler = new alerthandler_module(mock_event_bus, config, resume);
      if (parsed_data !== undefined && parsed_data !== null) {
        alerthandler.on('data', parsed_data);
      }
      sails.event_emitter.on('tick', function (timestamp) {
        alerthandler.on('tick', timestamp);
      });

      sails.notification_handlers[tag_id].push(alerthandler);
    }
  });
}

function setupHandheldDataParser () {
  var handheldParser = require('../helpers/HandheldParser');
  setInterval(function () {
    handheldParser(sails.handheld_data_path, true, function (handheld_data) {
      for (var row in handheld_data) {
        HandheldData.create(handheld_data[row]).done(function (err, new_data) {
          if (err) {
            sails.log.error("HandheldData was not saved successfully");
            return;
          }

          sails.log.info("HandheldData was saved successfully");
        });
      }
    });
  }, 60000);
}

function loadRecentAlerts () {
  // NOTE: This may not work for multiple alerts for each rfid (this query will need to be modified)
  var query = "SELECT b.* FROM " + 
    "(SELECT rfidTagNum, MAX(timestamp) AS maxsupdate FROM alertdata GROUP BY rfidTagNum) a " + 
    "INNER JOIN alertdata b ON a.rfidTagNum = b.rfidTagNum AND a.maxsupdate = b.timestamp ORDER BY b.id;";

  sails.log.debug("Attempting to find recent alert data");
  AlertData.query(query, function (err, alert_data) {
    if (err) { 
      sails.log.error("AlertData was not successfully loaded"); 
      return; 
    }

    sails.log.debug("Found recent alert data");

    for (i in alert_data) {
      initializeAlertHandler('rfid-' + alert_data[i].rfidTagNum, null, alert_data[i]);
      sails.recent_alerts[alert_data[i].rfidTagNum] = alert_data[i];
    }
  });
}

function loadRecentRfidData () {
  var query = "SELECT b.* FROM " + 
    "(SELECT rfidTagNum, MAX(timestamp) AS maxsupdate FROM rfiddata GROUP BY rfidTagNum) a " + 
    "INNER JOIN rfiddata b ON a.rfidTagNum = b.rfidTagNum AND a.maxsupdate = b.timestamp ORDER BY b.id;";

  sails.log.debug("Attempting to find recent RFID data");
  RfidData.query(query, function (err, rfid_data) {
    if (err) { 
      sails.log.error("RfidData was not successfully loaded"); 
      return; 
    }

    sails.log.debug("Found recent RFID data");

    for (i in rfid_data) {
      sails.recent_rfid_data[rfid_data[i].rfidTagNum] = rfid_data[i];
    }
  });
}