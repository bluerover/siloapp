module.exports = {
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  // TODO: Add organization association to check if handheld data can be shown
  get_data: function (req, res) {
    var range_start,
      range_end,
      max_range = 6 * 30 * 24 * 60 * 60, // Approximately 6 months
      page,
      limit,
      sort,
      csv = req.query.csv || false,
      timezone_shift;

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
    if (req.query.timezone_shift !== undefined) {
      timezone_shift = parseInt(req.query.timezone_shift);
    }

    if (csv === '1') {
      sails.log.debug("Attempting to read handheld data for HandheldData#get_data");
      HandheldData.query("select hd.* " +
        "from handhelddata as hd join handheld as h on hd.device_id = h.device_id " + 
        "where timestamp >= ? and timestamp <= ? and organization = ? " + 
        "order by timestamp " + sort,
        [range_start, range_end, req.session.organization],
        function (err, data) {
          if (err) {
            sails.log.error("There was an error retrieving handheld data: " + err);
            res.json({error: "Internal server error"}, 500);
            return;
          }

          if (data !== undefined && data !== null) {
            sails.log.info("Retrieved handheld data for HandheldData#get_data");

            // Filter data
            data = data.filter(function (i) {
              return i.device_id[0] !== undefined;
            });

            var file = "Device ID,Probe ID,Item Name,User ID,Temperature,Alarm,Timestamp\n";
            var moment = require('moment');
            for (var row in data) {
              file += data[row]['device_id'] + ",";
              file += data[row]['probe_id'] + ",";
              file += data[row]['item_name'] + ",";
              file += data[row]['user_id'] + ",";
              file += data[row]['temperature'] + ",";
              file += (parseInt(data[row]['alarm']) === 0 ? "No" : "Yes") + ",";
              file += moment.unix(data[row]['timestamp']).subtract(timezone_shift,'minute').format("MM/DD/YYYY hh:mm:ss a");
              file += "\n"
            }
            sails.log.info(file);
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Content-Disposition': "attachment; filename=handheld_" + range_start + "_" + range_end + ".csv"
            });
            res.end(file);
          }
      });
    }
    else {
      sails.log.debug("Attempting to read handheld data for HandheldData#get_data");
      HandheldData.query("select hd.* " +
        "from handhelddata as hd join handheld as h on hd.device_id = h.device_id " + 
        "where timestamp >= ? and timestamp <= ? and organization = ? " + 
        "order by timestamp " + sort + " limit ? offset ?",
        [range_start, range_end, req.session.organization, limit, page * limit],
        function (err, data) {
          if (err) {
            sails.log.error("There was an error retrieving handheld data: " + err);
            res.json({error: "Internal server error"}, 500);
            return;
          }

          if (data !== undefined && data !== null) {
            sails.log.info("Retrieved handheld data for HandheldData#get_data");

            // Filter data
            data = data.filter(function (i) {
              return i.device_id[0] !== undefined;
            });

            res.json(JSON.stringify(data));
          }
      });
    }
  }
}