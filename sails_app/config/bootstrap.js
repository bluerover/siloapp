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

  // sails.socket_listeners = {};
  sails.notification_handlers = {};
  sails.recent_alerts = {};
  sails.recent_rfid_data = {};
  sails.silo_levels = {};

  createEventEmitters();
  // setupTickEvent();
  setupSiloLevels();
  setupEventListeners();
  loadRecentAlerts();
  loadRecentSiloData();

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

function setupSiloLevels() {
  Silo.find().exec(function (err, silos) {
    if(err) {
      sails.log.error("Cannot setup silo levels: " + err);
      return;
    }
    for(var index in silos) {
      var silo = silos[index];
      sails.silo_levels[silo.rfid] = [silo.capacity, silo.level_1, silo.level_2, silo.level_3, silo.level_4];
    }
  });
}

function setupBlueRoverApi() {

  function zeroPad(num, numZeros) {
    var zeros = Math.max(0, numZeros - Math.floor(num).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    return zeroString+num;
  }
  var bluerover = require('node-bluerover-api');

  bluerover.setCredentials({
    key: "yXIJ1omZUNtbo6wNjMOkKYBLNJakn0nr/OzgVtDKh2i5lDktVT2xv5xfbYlCkW+Z",
    token: "9DquKlyhPKpZ35mxcjG/JUqWAd//U12O13ja6Wqp",
    baseUrl: "http://developers.bluerover.us"});

    var streamBuffer = "";
    // Open the BlueRover API stream
    sails.log.info("Opening blueRover stream");
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
                    var jsonObj = JSON.parse(json);
                    if (typeof(jsonObj.rfidTagNum) === 'undefined' || jsonObj.rfidTagNum === null) {
                      return;
                    }
                    //Add more data by parsing some of the raw data to get level
                    jsonObj["binaryLevel"] = zeroPad(parseInt(jsonObj["rawData"].slice(58,62),16).toString(2),4);
                    for(var index in jsonObj["binaryLevel"]) {
                      if(jsonObj["binaryLevel"][index] === "1") {
                        try {
                          jsonObj["level"] = sails.silo_levels[jsonObj["rfidTagNum"]][index];
                        } catch(e) {
                          sails.log.error("no rfid #" + jsonObj["rfidTagNum"] + " being collected");
                          return;
                        }
                        break;
                      }
                    }
                    if(!jsonObj["level"] || jsonObj["level"] === undefined) {
                      jsonObj["level"] = 0;
                    }
                    sails.log.info("Retrieved and parsed Stream API data");
                    sails.event_emitter.emit('parsed_data', jsonObj);
                }

                streamBuffer = str;
                //console.log("Remaining string in buffer: " + streamBuffer);
            }
            catch(e) {
                sails.log.error("Could not parse JSON: " + e.toString());
                sails.log.info("Error...clearing the stream buffer");
                console.log(streamBuffer);
                streamBuffer = "";
            }
        }
    });
}

function setupEventListeners() {
  var circBuffer = require('../helpers/CircularBuffer');
  var util = require('util');

  // This listener takes the parsed data and broadcasts on the rfid-* channel
  // sails.event_emitter.on('parsed_data', function(data) {
    // This is to cache the last 20 events for each rfid in memory (right now we just load it from the DB)
    // if (!(data['rfidTagNum'] in sails.rfid_history)) {
    //     sails.rfid_history[data['rfidTagNum']] = new circBuffer(20);
    // }

    // sails.rfid_history[data['rfidTagNum']].push(data);

  //   sails.event_emitter.emit('rfid-' + data['rfidTagNum'], data);
  // });

  // Save parsed data to database
  sails.event_emitter.on('parsed_data', function(data) {
    if (typeof(data.rfidTagNum) === 'undefined' || data.rfidTagNum === null) {
      return;
    }
    sails.log.debug("Attempting to write rfid data to database: " + data.rfidTagNum);
    SiloData.create(data).exec(function (err, silodata) {
      if (err) { sails.log.error("Error saving silo data to database: " + util.inspect(err)); }
      else { sails.log.info("Wrote new silo data to database: rfid#" + silodata.rfidTagNum); }
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
      sails.log.info("Running alert handler for " + tag_id);
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

  sails.event_emitter.on('email', function (data) {
    Silo.findOne({rfid: data.rfidTagNum}).populate('farm').populate('product').exec(function (err, silo) {
      if(err) {
        sails.log.error("No silo found for rfid #" + data.rfidTagNum + ": " + err);
        return;
      }
      Organization.findOne(silo.farm.organization).exec(function (err, organization) {
        if(err) {
          sails.log.error("No organization found for organization #" + silo.farm.organization + ": " + err);
          return;
        }
        User.find({organization: organization.id}).exec(function (err, users) {
          if(err) {
            sails.log.error("No users found for organization #" + organization.id + ": " + err);
            return;
          }
          for(var index in users) {
            if (users[index].is_alert_active) {
              var emailData = {};
              emailData.username = users[index].username;
              emailData.email_address = users[index].email;
              emailData.silo = silo.id;
              emailData.alarm_status = data.status;
              emailData.threshold = data.threshold;
              var nodemailer = require("nodemailer");
              var smtpTransport = nodemailer.createTransport("sendmail");

              sails.log.info("Sending email to " + emailData.username);
              var mail = function(emailData, silo, farm, organization, user) {
                var tmp = function() {
                  smtpTransport.sendMail({
                   from: "BlueRover Alerts <alerts@blueRover.ca>", // sender address
                   to: user.full_name() + "<" + user.email + ">", // comma separated list of receivers
                   subject: organization.name + " Bin Volume Alert", // Subject line
                   html: "<p>Hi " + user.first_name + ",<br/><br/>"
                         + "Please check your silo in " + farm.name + " for " + organization.name + " at "
                         + "<a href='safefarm.bluerover.us/silo/" + silo.id +"'>safefarm.bluerover.us</a><br/><br/>"
                         + "Reason: <b>" + silo.name + " (" + silo.product.name + ")</b> at " + farm.name
                         + " is at <b>" + emailData.threshold + "%</b> of its capacity (" + silo.capacity + ") Please acknowledge.<br/></p>"
                  }, function(error, response) {
                    if(error) {
                        emailData.email_status = error;
                        sails.log.info("Email not sent to " + emailData.username + ": " + error);
                    } else {
                        emailData.email_status = "success";
                        sails.log.info("Message sent to : " + emailData.username);
                    }
                    Email.create(emailData).exec(function (err, d) {
                      if (err) { sails.log.error("Email was not saved successfully: " + err); }
                      else { sails.log.info("Wrote email to database"); }
                    });
                  });
                }
                return tmp;
              }
              setTimeout(mail(emailData, silo, silo.farm, organization, users[index]),20);
            }
          }
        });
      });
    });
  });
}

function initializeAlertHandler(tag_id, parsed_data, resume_data) {
  var parsed_rfid = tag_id.substring(5);
  sails.log.debug("Attempting to find alerthandler from database");
  RfidAlerthandler.find({rfid: parsed_rfid}).exec(function (err, alerthandler_data) {
    if (err) { sails.log.error("There was a problem finding the alerthandlers for an rfid: " + err); return; }

    if (alerthandler_data === undefined || alerthandler_data === null || alerthandler_data.length === 0) {
      sails.log.info("no alert handlers found");
      return;
    }
    sails.log.info("alerthandler found!");

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
          // sails.alert_emitter.emit(tag_id, data);
          sails.recent_alerts[this.rfid] = data;
          sails.log.debug("Attempting to write alert to database");
          AlertData.create(data).exec(function (err, d) {
            if (err) sails.log.error("AlertData was not saved successfully: " + err);
            sails.log.info("Wrote alert to database");
          });

          // send an email on alarm or when alerthandler tells us to send
          if(data.send) {
            sails.event_emitter.emit('email',data);
          }
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
      // sails.event_emitter.on('tick', function (timestamp) {
      //   alerthandler.on('tick', timestamp);
      // });

      sails.notification_handlers[tag_id].push(alerthandler);
    }
  });
}

function loadRecentAlerts () {
  // NOTE: This may not work for multiple alerts for each rfid (this query will need to be modified)
  var query = "SELECT b.* FROM " + 
    "(SELECT rfidTagNum, MAX(timestamp) AS maxsupdate FROM alertdata GROUP BY rfidTagNum) a " + 
    "INNER JOIN alertdata b ON a.rfidTagNum = b.rfidTagNum AND a.maxsupdate = b.timestamp ORDER BY b.id;";

  sails.log.debug("Attempting to find recent alert data");
  AlertData.query(query, function (err, alert_data) {
    if (err) { 
      sails.log.error("AlertData was not successfully loaded: " + err); 
      return; 
    }

    sails.log.debug("Found recent alert data");

    rfidArray = [];
    for (i in alert_data) {
      if(rfidArray.indexOf(alert_data[i].rfidTagNum) === -1) {
	       initializeAlertHandler('rfid-' + alert_data[i].rfidTagNum, null, alert_data[i]);
     	   sails.recent_alerts[alert_data[i].rfidTagNum] = alert_data[i];
	       rfidArray.push(alert_data[i].rfidTagNum);
      }
    }
    var id = setInterval(function() {
      if(Object.keys(sails.notification_handlers).length === rfidArray.length) {
        if(sails.silo_levels) {
          clearInterval(id);
          setupBlueRoverApi();
        }
      } else {
        sails.log.info(Object.keys(sails.notification_handlers).length + "/" + rfidArray.length);
      }
    },10*1000);
  });
}

function loadRecentSiloData () {
  var query = "SELECT b.* FROM " + 
    "(SELECT rfidTagNum, MAX(timestamp) AS maxsupdate FROM silodata GROUP BY rfidTagNum) a " + 
    "INNER JOIN silodata b ON a.rfidTagNum = b.rfidTagNum AND a.maxsupdate = b.timestamp ORDER BY b.id;";

  sails.log.debug("Attempting to find recent silo data");
  SiloData.query(query, function (err, silodata) {
    if (err) { 
      sails.log.error("SiloData was not successfully loaded: " + err); 
      return; 
    }

    sails.log.debug("Found recent Silo data");

    for (i in silodata) {
      sails.recent_rfid_data[silodata[i].rfidTagNum] = silodata[i];
    }
  });
}
