/**
 * PerformanceController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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
   * (specific to PerformanceController)
   */
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  get_settings: function(req, res) {
    sails.log.info("Getting performance settings");
  	Performance.find({organization: req.session.organization}).sort('createdAt desc').exec(function (err, performance) {
  		if (err) {
  			sails.log.error("There was an error retrieving performance data: " + err);
  			return;
  		}
  		Rfid.query("select rfid.id, display_name, display_name_2 from rfid " +
    		"where organization = ? order by display_name asc, display_name_2 asc",
    		[req.session.organization], function (err, rfidData) {
  			if (err) {
  				sails.log.error("There was an error retrieving rfid data: " + err);
  				return;
  			}
  			if (performance.length === 0) {
  				//only send the rfid data
  				res.json("{\"rfids\" : " + JSON.stringify(rfidData) + "}");
  			} else {
  				// we have both, combine to one json object and send it
  				res.json("{\"performance\" : " + JSON.stringify(performance) + "," +
                   " \"rfids\" : " + JSON.stringify(rfidData) + "}");
  			}
		  });
  	});
  },

  save_settings: function(req,res) {
    //get the data, add the organization to json object, put it in performance
    timeFilters = req.query["timeFilters"];
    delete req.query["timeFilters"];

    Performance.create({organization: req.session.organization, timefilters: JSON.stringify(timeFilters),
                       thresholds: JSON.stringify(req.query)}).exec(function (err, performanceData) {
      if (err) {
        sails.log.error("Error saving performance data to database: " + err);
        res.json({"error": err}, 500);
      }
      else {
       sails.log.info("Performance data saved in database");
       res.json({},200);
      }
    });
  },

};