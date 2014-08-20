/**
 * AnalyticsController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  index: function (req, res) {
  	//get all the compliance reports for that specific org
  	ComplianceReport.find().where({organization: req.session.organization}).where({status: "complete"}).exec(function (err, reportList) {
  		reportJSON = ""
  		function done() {
  			res.view({
		      title: "BlueRover Analytics",
		      organization_num: req.session.organization_num,
		      organization_name: req.session.organization_name,
		      page_category: "analytics",
		      full_name: req.session.full_name,
		      reportList: reportList,
		      reportJSON: reportJSON,
		      report_id: req.query.id
		    });	
  		}
  		if(req.query.id) {
  			var id = parseInt(req.query.id,10);
  			var length = reportList.length;
  			var flag = false;
			for (var i = 0; i < length; i++) {
			    if(reportList[i].id === id) {
			    	var flag = true;
			    	var fs = require('fs');
				    fs.readFile('/reports/' + id + '_report.log', 'utf-8', function (err,reportData) {
				      if (err) {
				        sails.log.error("Error with fs: " + err);
				        res.json(JSON.stringify(err),500);
				        return;
				      }
				      var zlib = require('zlib');
				      zlib.unzip(new Buffer(reportData,'base64'), function(err,buffer) {
				        if (err) {
				          sails.log.error("Error with gzip: " + err);
				          res.json(JSON.stringify(err),500);
				          return;
				        }
				        data = JSON.parse(buffer.toString());
				        reportJSON = [];
				        var moment = require('moment');
						for (var timeframe in data) {
							var times = timeframe.split("_");
							var timeString = moment.unix(times[0]).format("MMM DD YYYY h:mmA") + " - " + moment.unix(times[1]).format("h:mmA");
							for(var asset in data[timeframe]) {
							  var tmpObj = {};
							  tmpObj["Timeframe"] = timeString;
							  tmpObj["Asset Name"] = data[timeframe][asset].display_name;
							  tmpObj["Sensor Type"] = data[timeframe][asset].display_name_2;
							  tmpObj["Threshold"] = data[timeframe][asset].threshold;
							  tmpObj["Average"] = data[timeframe][asset].avgTemp;
							  tmpObj["Variance"] = data[timeframe][asset].varTemp;
							  tmpObj["Temps Pass"] = data[timeframe][asset].passingTemp + "/" + data[timeframe][asset].total;
							  tmpObj["% Pass"] = (data[timeframe][asset].passingTemp/data[timeframe][asset].total).toFixed(2);
							  tmpObj["Result"] = data[timeframe][asset].result;
							  reportJSON.push(tmpObj);
							}
						}
				        done();
				      });
				    });
			    }
			}
			if(!flag) {
				done();	
			}
  		} else {
  			done();
  		}
  	});
  },

  get_graphdata: function(req,res) {
  	var id = parseInt(req.query.id,10);
  	ComplianceReport.findOne(id).exec(function (err, report) {
  		if(err) {
  			sails.log.info("Error retrieving report: " + err);
  			res.json(err,500);
  			return;
  		} else if(req.session.organization !== report.organization) {
  			res.json("Error: you are not authorized to view this report",403);
  			return;
  		}
  		var fs = require('fs');
  		fs.readFile('/reports/' + id + '_report.log', 'utf-8', function (err,reportData) {
	      if (err) {
	        sails.log.error("Error with fs: " + err);
	        res.json(JSON.stringify(err),500);
	        return;
	      }
	      var zlib = require('zlib');
	      zlib.unzip(new Buffer(reportData,'base64'), function(err,buffer) {
	        if (err) {
	          sails.log.error("Error with gzip: " + err);
	          res.json(JSON.stringify(err),500);
	          return;
	        }
	        data = JSON.parse(buffer.toString());
	        reportJSON = [];
	        var moment = require('moment');
			for (var timeframe in data) {
				var times = timeframe.split("_");
				var timeString = moment.unix(times[0]).format("MMM DD YYYY h:mmA") + " - " + moment.unix(times[1]).format("h:mmA");
				for(var asset in data[timeframe]) {
				  var tmpObj = {};
				  tmpObj["Timeframe"] = timeString;
				  tmpObj["Asset Name"] = data[timeframe][asset].display_name;
				  tmpObj["Sensor Type"] = data[timeframe][asset].display_name_2;
				  tmpObj["Threshold"] = data[timeframe][asset].threshold;
				  tmpObj["Average"] = data[timeframe][asset].avgTemp;
				  tmpObj["Variance"] = data[timeframe][asset].varTemp;
				  tmpObj["Temps Pass"] = data[timeframe][asset].passingTemp + "/" + data[timeframe][asset].total;
				  tmpObj["% Pass"] = (data[timeframe][asset].passingTemp/data[timeframe][asset].total).toFixed(2);
				  tmpObj["Result"] = data[timeframe][asset].result;
				  reportJSON.push(tmpObj);
				}
			}
	        res.json(JSON.stringify(reportJSON));
	      });
	    });
  	});
  }
};
