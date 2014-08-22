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

  silosearch: function(req,res) {
  	var errorFlag = false;
  	var errorMsg = "";
  	for(var item in req.query) {
  		if(!req.query[item].value || req.query[item].value === undefined) {
  			errorFlag = true;
  			errorMsg += req.query[item].name + " must be a proper value\n";
  		}
  	}
  	if(errorFlag) {
  		res.json(errorMsg,403);
  		return;
  	}

  	//Get all the silos in the region with such product
  	Silo.query("SELECT silo.id FROM silo JOIN farm on farm.id = silo.farm " + 
  			   "WHERE silo.product = ? AND farm.region = ?",[req.query.silo, req.query.region],
    function (err,silos) {
    	if(err) {
    		sails.log.error("Error when getting subset of silos: " + err);
    		res.json(err,500);
    		return;
    	}
    	var siloString = "";
    	for(var index in silos) {
    		siloString += silos[index].id + ",";
    	}

    	//Now to get all the silodata for those silos
    	SiloData.query("SELECT L.silo, L.level, L.timestamp FROM silodata L " +
					   "LEFT JOIN silodata R ON " +
					   "L.silo = R.silo AND " +
					   "L.timestamp < R.timestamp " +
					   "WHERE isnull(R.silo) and L.silo in (?) order by level asc",siloString.slice(0,-1),
		function (err, siloData) {
			if(err) {
				sails.log.error("Error when getting recent silo data: " + err);
	    		res.json(err,500);
	    		return;
	    	}
	    	//i want this to go to a partial view
	    	res.json(siloData);
		});
    });
  }

  
};

