/**
 * RfidDataController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to WidgetController)
   */
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  // GET /rfid_data
  get_data: function (req, res) {
    var range_start,
      range_end,
      max_range = 6 * 30 * 24 * 60 * 60, // Approximately 6 months
      page,
      limit,
      sort,
      csv = req.query.csv || false;

    if (req.query.page !== undefined) {
      page = parseInt(req.query.page);
    }
    else {
      page = 0;
    }

    if (req.query.limit !== undefined) {
      limit = parseInt(req.query.limit);
    }
    else {
      limit = 10;
    }

    if (typeof(req.query.sort) === 'string' && (req.query.sort.toLowerCase() === 'asc' || req.query.sort.toLowerCase() === 'desc')) {
      sort = req.query.sort;
    }
    else {
      sort = 'asc';
    }

    if (req.query.range_end !== undefined) {
      range_end = parseInt(req.query.range_end);
    }
    else {
      range_end = Math.round(new Date().getTime() / 1000);
    }

    if (req.query.range_start !== undefined) {
      range_start = parseInt(req.query.range_start);
    }
    else {
      // If no range specified, subtract 7 days from the start time
      range_start = range_end - (7 * 24 * 60 * 60);
    }

    if (range_end < range_start) {
      res.json({error: "The end date must be after the start date."}, 422);
      return;
    }

    if (range_start < 0 || range_end < 0) {
      res.json({error: "The start and end timestamps must be greater than zero."}, 422);
      return;
    }

    if (range_end - range_start > max_range) {
      res.json({error: "The specified date range was too large."}, 422);
      return;
    }

    if (csv === '1') {
      sails.log.debug("Attempting to read rfid data for RfidData#get_data.csv");
      RfidData.query("select rd.*, r.organization, r.display_name " + 
        "from rfiddata as rd join rfid as r on rd.rfidTagNum = r.id " +
        "where timestamp >= ? and timestamp <= ? and organization = ? " + 
        "order by timestamp " + sort, 
        [range_start, range_end, req.session.organization, limit, page * limit], 
        function (err, data) {
          if (err) {
            sails.log.error("There was an error retrieving RFID data: " + err);
            res.json({error: "Internal server error"}, 500);
            return;
          }

          // Filter out RFIDs that aren't for the current user
          data = data.filter(function (i) {
            return i.rfidTagNum !== undefined && i.organization === req.session.organization;
          });

          sails.log.info("Retrieved RFID data for RfidData#get_data");

          var file = "Device ID,Status Code,RFID Tag Number,Asset Name,RFID Temperature,Timestamp\n";
          var moment = require('moment');
          for (var row in data) {
            file += data[row]['deviceID'] + ",";
            file += data[row]['statusCode'] + ",";
            file += data[row]['rfidTagNum'] + ",";
            file += data[row]['display_name'] + ",";
            file += data[row]['rfidTemperature'] + ",";
            file += moment.unix(data[row]['timestamp']).format("MM/DD/YYYY hh:mm:ss a");
            file += "\n"
          }
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Content-Disposition': "attachment; filename=rfid_" + range_start + "_" + range_end + ".csv"
          });
          res.end(file);
      });
    }
    else {
      sails.log.debug("Attempting to read rfid data for RfidData#get_data");
      RfidData.query("select rd.*, r.organization, r.display_name " + 
        "from rfiddata as rd join rfid as r on rd.rfidTagNum = r.id " +
        "where timestamp >= ? and timestamp <= ? and organization = ? " + 
        "order by timestamp " + sort + " limit ? offset ?", 
        [range_start, range_end, req.session.organization, limit, page * limit], 
        function (err, data) {
        if (err) {
          sails.log.error("There was an error retrieving RFID data: " + err);
          res.json({error: "Internal server error"}, 500);
          return;
        }

        // Filter out RFIDs that aren't for the current user
        data = data.filter(function (i) {
          return i.rfidTagNum !== undefined && i.organization === req.session.organization;
        });

        sails.log.info("Retrieved RFID data for RfidData#get_data");
        res.json(JSON.stringify(data));
      });
    }
  },

  // GET /rfid_data/:id/recent
  get_recent_data_for_rfid: function (req, res) {
    var rfid = req.param('id');
    RfidData.find({rfidTagNum: rfid}).populate('rfidTagNum').limit(20).sort('timestamp desc').exec(function (err, rfid_data) {
      if (err) sails.log.error("Error loading recent RFID data: " + err);
      if (rfid_data !== undefined && rfid_data !== null) {

        rfid_data = rfid_data.filter(function (i) {
          return i.rfidTagNum !== undefined && i.rfidTagNum.organization === req.session.organization;
        });

        res.json(rfid_data);
      }
    });
  }

  
};
