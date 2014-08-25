/**
 * SiloDataController
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
    
  _config: {
    blueprints: {
      rest: true
    }
  },

  get_recent_silo_data: function (req, res) {
    var siloId = req.param('id');
    SiloData.find({silo: siloId}).populate("silo").sort('timestamp desc').limit(20).exec(function (err, siloData) {
      if (err) sails.log.error("Error loading recent silo data: " + err);
      if (siloData !== undefined && siloData !== null) {

        // rfid_data = rfid_data.filter(function (i) {
        //   return i.rfidTagNum !== undefined && i.rfidTagNum.organization === req.session.organization;
        // });
        res.json(JSON.stringify(siloData));
      } else {
      	res.json("undefined or null silo data",400);
      }
    });
  }
};

