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
    var rfid = req.param('id');
    SiloData.find({rfidTagNum: rfid}).sort('timestamp desc').limit(1).exec(function (err, siloData) {
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
  },

  get_data_changes: function (req, res) {
    
    var rfid = req.param('id');
    var from = req.param('from');
    var to = req.param('to');

    var query = {rfidTagNum: rfid};
    if (!(from == null && to == null)) query.timestamp = {};
    if (!(from == null)) query.timestamp['>'] = new Date(from);
    if (!(to == null)) query.timestamp['<'] = new Date(from);

    SiloData.find().where(query).sort('timestamp').exec(function (err, siloData) {
      if (err) { 
        sails.log.error("Error loading recent silo data: " + err);
        return res.view('500', {layout: 'barebones'});
      }
      if (siloData !== undefined && siloData !== null) {
        Silo.findOne({rfid: rfid}).populateAll().exec(function (err, silo) {
          if (err) { 
            sails.log.error("Error loading recent silo: " + err);
            return res.view('500', {layout: 'barebones'});
          }   
          if (silo !== undefined && silo !== null) {
            
            //only get the edges
            siloData = _.filter(siloData, function (dataPoint, index, allData) {
              if (index == 0) return true;
              return dataPoint.level !== allData[index - 1].level;
            })

            return res.json({silo: silo, data: siloData}); //return format

          } else {
            return res.json("undefind or null silo",404)
          } 
        })
      } else {
        return res.json("undefined or null silo data",404);
      }
    })
  }
};