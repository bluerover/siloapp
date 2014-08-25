/**
 * SiloController
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
    Silo.findOne(id).populate("product").exec(function (err, silo) {
      if (err) {
        sails.log.error("Error when retrieving silo " + err);
        res.view({layout: "barebones"}, '500');
        return;
      } 
      req.session.current_silo = silo.id;
      req.session.current_farm = silo.farm;
      Farm.findOne({id: silo.farm}).populate("region").exec(function (err, farm) {
        if (err) {
          sails.log.error("Error when retrieving farm " + err);
          res.view({layout: "barebones"}, '500');
          return;
        } 
        SiloData.find({silo: silo.id}).sort("timestamp desc").limit(10).exec(function (err, silodata) {
          // console.log(silodata);
          //we don't really care if you don't past data
          SiloChangelog.find({silo: silo.id}).sort("timestamp desc").limit(5).exec(function (err, siloChanges) {
            //we don't really care if you don't have any changes
            // console.log(siloChanges);
            res.view({
              title: "Silo: " + silo.name, 
              page_category: "silo",
              full_name: req.session.full_name,
              current_farm: req.session.current_farm,
              current_silo: req.session.current_silo,
              silo: silo,
              farm: farm,
              silodata: silodata,
              siloChanges: siloChanges
            });
          });
        });
      });
    });
  },

  silosearch: function(req,res) {
  	var errorFlag = false;
  	var errorMsg = "";
  	for(var item in req.query) {
  		if(!req.query[item] || req.query[item] === undefined) {
  			errorFlag = true;
  			errorMsg += item + " must be a proper value\n";
  		} else if (req.query[item] !== "%") {
        req.query[item] = parseInt(req.query[item]);
      }
  	}
  	if(errorFlag) {
  		res.json(errorMsg,400);
  		return;
  	}
  	//Get all the silos in the region with such product
  	Silo.query("SELECT silo.id, silo.name, silo.location FROM silo JOIN farm on farm.id = silo.farm " + 
  			   "WHERE silo.product LIKE ? AND farm.region LIKE ?",[req.query.product, req.query.region],
    function (err,silos) {
    	if(err) {
    		sails.log.error("Error when getting subset of silos: " + err);
    		res.json(err,500);
    		return;
    	} else if (silos.length === 0) {
        res.json("No silos match your criteria, please try again",400);
        return;
      }
    	var siloString = "";
    	for(var index in silos) {
    		siloString += silos[index].id + ",";
    	}
    	//Now to get all the silodata for those silos
    	SiloData.query("SELECT L.silo, L.level, DATE_FORMAT(FROM_UNIXTIME(L.timestamp), '%b %e %Y, %T') as recent FROM silodata L " +
					   "LEFT JOIN silodata R ON " +
					   "L.silo = R.silo AND " +
					   "L.timestamp < R.timestamp " +
					   "WHERE isnull(R.silo) AND L.silo IN (" + siloString.slice(0,-1) + ") ORDER BY level ASC LIMIT 5",[],
		  function (err, siloData) {
  			if(err) {
  				sails.log.error("Error when getting recent silo data: " + err);
  	    		res.json(err,500);
  	    		return;
  	    	}
          var tableData = [];
          for(var index in siloData) {
            for(var index2 in silos) {
              if(silos[index2].id === siloData[index].silo) {
                siloData[index].name = silos[index2].name;
                siloData[index].location = silos[index2].name;
                tableData.push(siloData[index]);
              }
            }
          }
  	    	//i want this to go to a partial view
  	    	res.view('dashboard/silotable', {siloData: tableData, layout:null});
		  });
    });
  }
};