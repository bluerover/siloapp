/**
 * FarmController
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

  index: function(req,res) {
    var id = req.param('id');
    req.session.current_farm = id;
    var flag = false;
    function cb(farm,silos) {
      function compare(a,b) {
        if (a.id < b.id)
           return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }
      //may need to sort silos
      silos.sort(compare);
      if(!flag) {
        res.view({
          title: "Farm: " + farm.name, 
          page_category: "farm",
          full_name: req.session.full_name,
          current_farm: req.session.current_farm,
          current_silo: req.session.current_silo,
          farm: farm,
          silos: silos
        });
        flag = true;
      }
    }

    var silos = [];
    Farm.findOne(id).populateAll().exec(function (err, farm) {
      if (err) {
        sails.log.error("Error with retrieving farm: " + err);
        res.view({layout: "barebones"}, '500');
        return;
      } 
      var siloLength = farm.silos.length;
      var count = 0;
      for(var index in farm.silos) {
        if(typeof(farm.silos[index]) !== "function") {
          Silo.findOne({id: farm.silos[index].id}).populate("product").exec(function (err, silo) {
            if(err) {
              sails.log.error("Error with retrieving silos " + err);
              cb(farm,[]);
              return;
            } else {
              silos.push(silo);
              count++;
              if(count === siloLength) {
                cb(farm,silos);
                return;
              }
            }
          });
        }
      }
    });
  }
};
