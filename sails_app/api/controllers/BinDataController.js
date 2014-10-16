/**
 * BinDataController
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

  get_recent_bin_data: function (req, res) {
    var rfid = req.param('id');
    BinData.find({rfidTagNum: rfid}).sort('timestamp desc').limit(1).exec(function (err, binData) {
      if (err) sails.log.error("Error loading recent bin data: " + err);
      if (binData !== undefined && binData !== null) {

        // rfid_data = rfid_data.filter(function (i) {
        //   return i.rfidTagNum !== undefined && i.rfidTagNum.organization === req.session.organization;
        // });
        res.json(JSON.stringify(binData));
      } else {
      	res.json("undefined or null bin data",400);
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

    BinData.find().where(query).sort('timestamp').exec(function (err, binData) {
      if (err) { 
        sails.log.error("Error loading recent bin data: " + err);
        return res.view('500', {layout: 'barebones'});
      }
      if (binData !== undefined && binData !== null) {
        Bin.findOne({rfid: rfid}).populateAll().exec(function (err, bin) {
          if (err) { 
            sails.log.error("Error loading recent bin: " + err);
            return res.view('500', {layout: 'barebones'});
          }   
          if (bin !== undefined && bin !== null) {
            
            //only get the edges
            binData = _.filter(binData, function (dataPoint, index, allData) {
              if (index == 0) return true;
              return dataPoint.level !== allData[index - 1].level;
            })

            return res.json({bin: bin, data: binData}); //return format

          } else {
            return res.json("undefind or null bin",404)
          } 
        })
      } else {
        return res.json("undefined or null bin data",404);
      }
    })
  }
};