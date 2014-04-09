module.exports = {
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  get_data: function (req, res) {
    var range_start,
      range_end,
      max_range = 6 * 30 * 24 * 60 * 60; // Approximately 6 months

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

    // TODO: Only find data for your org
    sails.log.debug("Attempting to read handheld data for HandheldData#get_data");
    HandheldData.find().where({timestamp: {'>=': range_start, '<=': range_end}}).sort('timestamp').done(function (err, data) {
      if (err) {
        sails.log.error("There was an error retrieving handheld data: " + err);
        res.json({error: "Internal server error"}, 500);
        return;
      }

      sails.log.info("Retrieved handheld data for HandheldData#get_data");
      res.json(JSON.stringify(data));
    });
  }
}