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

  sails.custom_helpers = {};
  sails.custom_helpers.render_widget = function(widget) {
    var ejs = require('ejs');
    var fs = require('fs');
    var file = fs.readFileSync(sails.project_path + "/views/dashboard/partials/" + widget.template_filename).toString();
    rendered = ejs.render(file, { locals: {widget: widget} });
    return rendered;
  };

  sails.socket_listeners = {};
  sails.rfid_history = {};
  sails.notification_handlers = {};

  createEventEmitters();
  setupTickEvent();
  setupBlueRoverApi();
  setupEventListeners();

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
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
    if (!(data['rfidTagNum'] in sails.rfid_history)) {
        sails.rfid_history[data['rfidTagNum']] = new circBuffer(20);
    }

    sails.rfid_history[data['rfidTagNum']].push(data);

    sails.event_emitter.emit('rfid-' + data['rfidTagNum'], data);
  });

  // Save parsed data to database
  sails.event_emitter.on('parsed_data', function(data) {
    RfidData.create(data).done(function (err, rfid_data) {
      if (err) { sails.log.error("Error saving RFID data to database: " + util.inspect(err)); }
      else { sails.log.info("Wrote new RFID data to database"); }
    });
  });

  // Save parsed data to recent rfid data if the type is rfid
  sails.event_emitter.on('parsed_data', function (data) {
    if (typeof(data.rfidTagNum) !== 'undefined' && data.rfidTagNum !== null) {
      RecentRfidData.find({rfidTagNum: data.rfidTagNum}).done(function (err, recent_data) {
        if (err) sails.log.error("Error finding recent rfid: " + err);

        // If no row already exists in the database, create it
        if (recent_data.length === 0) {
          RecentRfidData.create(data).done(function (err, saved_data) {
            if (err) { sails.log.error("Error creating new recent data"); }
            else { sails.log.info("Wrote new recent data"); }
          });
        }
        // Otherwise update the loaded model
        else {
          for (var i in data) {
            if (data.hasOwnProperty(i)) {
              recent_data[0][i] = data[i];
            }
          }
          recent_data[0].save(function (err) {
            if (err) { sails.log.error("Error updating recent data"); }
            else { sails.log.info("Updated recent data"); }
          });
        }
      });
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

  function initializeAlertHandler(tag_id, parsed_data) {
    RfidAlerthandler.find({rfid: parsed_data.rfidTagNum}).done(function (err, alerthandler_data) {
      if (err) { sails.log.error("There was a problem finding the alerthandlers for an rfid: " + err); return; }

      if (alerthandler_data === undefined || alerthandler_data === null || alerthandler_data.length === 0) {
        return;
      }

      sails.notification_handlers[tag_id] = [];
      for (var index in alerthandler_data) {
        var alerthandler_filename = alerthandler_data[index].alerthandler_name;

        // This is to prevent alert handlers from hijacking the real event bus
        var mock_event_bus = {
          rfid: parsed_data.rfidTagNum,
          emit: function(channel, data) {
            data.timestamp = new Date().getTime();
            data.alerthandler_name = alerthandler_filename;
            data.rfidTagNum = this.rfid;
            sails.alert_emitter.emit(tag_id, data);
            // TODO: Write alert to database
          }
        };

        // TODO: Resume data
        var resume_data = null;
        var config = JSON.parse(alerthandler_data[index].config);
        var alerthandler_module = require('../alerthandlers/' + alerthandler_filename + ".js");
        var alerthandler = new alerthandler_module(mock_event_bus, config, resume_data);
        alerthandler.on('data', parsed_data);
        sails.event_emitter.on('tick', function (timestamp) {
          alerthandler.on('tick', timestamp);
        });

        sails.notification_handlers[tag_id].push(alerthandler);
      }
    });
  }
}