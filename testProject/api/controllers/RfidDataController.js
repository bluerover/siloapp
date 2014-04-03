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
    res.json({error: "Endpoint not found"}, 404);
  },

  // GET /rfid_data/:rfid
  get_recent_data_for_rfid: function (req, res) {
    var rfid = req.param('id');
    RfidData.find({rfidTagNum: rfid}).limit(20).sort('timestamp').done(function (err, rfid_data) {
      if (err) sails.log.error("Error loading recent RFID data: " + err);
      if (rfid_data !== undefined && rfid_data !== null) {
        res.json(rfid_data);
      }
    });
  }

  
};
