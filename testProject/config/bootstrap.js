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

  sails.socketListeners = {};
  sails.rfid_history = {};

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

  // This listener takes the parsed data and broadcasts on the rfid-* channel
  sails.event_emitter.on('parsed_data', function(data) {
    if (!(data['rfidTagNum'] in sails.rfid_history)) {
        sails.rfid_history[data['rfidTagNum']] = new circBuffer(20);
    }

    sails.rfid_history[data['rfidTagNum']].push(data);

    sails.event_emitter.emit('rfid-' + data['rfidTagNum'], data);
  });

  sails.event_emitter.on('parsed_data', function(data) {
    RfidData.create(data).done(function (err, rfid_data) {
      if (err) { sails.log.error("Error saving RFID data to database: " + err); }
      else { sails.log.info("Wrote new RFID data to database"); }
    });
  });
}