/**
 * ComplianceController
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
   * (specific to ComplianceController)
   */
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  // GET /compliance_data
//   get_data: function (req, res) {
//     var range_start,
//       range_end,
//       max_range = 6 * 30 * 24 * 60 * 60, // Approximately 6 months
//       page,
//       limit,
//       sort,
//       csv = req.query.csv || false;

//     if (req.query.page !== undefined) {
//       page = parseInt(req.query.page);
//     }
//     else {
//       page = 0;
//     }

//     /*if (req.query.limit !== undefined) {
//       limit = parseInt(req.query.limit);
//     }
//     else {
//       limit = 10;
//     }
// */
//     if (typeof(req.query.sort) === 'string' && (req.query.sort.toLowerCase() === 'asc' || req.query.sort.toLowerCase() === 'desc')) {
//       sort = req.query.sort;
//     }
//     else {
//       sort = 'asc';
//     }

//     if (req.query.range_end !== undefined) {
//       range_end = parseInt(req.query.range_end);
//     }
//     else {
//       range_end = Math.round(new Date().getTime() / 1000);
//     }

//     if (req.query.range_start !== undefined) {
//       range_start = parseInt(req.query.range_start);
//     }
//     else {
//       // If no range specified, subtract 7 days from the start time
//       range_start = range_end - (7 * 24 * 60 * 60);
//     }

//     if (range_end < range_start) {
//       res.json({error: "The end date must be after the start date."}, 422);
//       return;
//     }

//     if (range_start < 0 || range_end < 0) {
//       res.json({error: "The start and end timestamps must be greater than zero."}, 422);
//       return;
//     }

//     if (range_end - range_start > max_range) {
//       res.json({error: "The specified date range was too large."}, 422);
//       return;
//     }

//     if (csv === '1') {
//       sails.log.debug("Attempting to read rfid data for RfidData#get_data.csv");
//       RfidData.query("select rd.*, r.organization, r.display_name, r.display_name_2 " + 
//         "from rfiddata as rd join rfid as r on rd.rfidTagNum = r.id " +
//         "where timestamp >= ? and timestamp <= ? and organization = ? " + 
//         "order by timestamp " + sort, 
//         [range_start, range_end, req.session.organization], 
//         function (err, data) {
//           if (err) {
//             sails.log.error("There was an error retrieving RFID data: " + err);
//             res.json({error: "Internal server error"}, 500);
//             return;
//           }

//           // Filter out RFIDs that aren't for the current user
//           data = data.filter(function (i) {
//             return i.rfidTagNum !== undefined && i.organization === req.session.organization;
//           });

//           sails.log.info("Retrieved RFID data for RfidData#get_data");

//           var file = "Device ID,Status Code,RFID Tag Number,Asset Name,Sensor Type,RFID Temperature,Timestamp\n";
//           var moment = require('moment');
//           for (var row in data) {
//             file += data[row]['deviceID'] + ",";
//             file += data[row]['statusCode'] + ",";
//             file += data[row]['rfidTagNum'] + ",";
//             file += data[row]['display_name'] + ",";
//             file += data[row]['display_name_2'] + ",";
//             file += data[row]['rfidTemperature'] + ",";
//             file += moment.unix(data[row]['timestamp']).format("MM/DD/YYYY hh:mm:ss a");
//             file += "\n"
//           }
//           res.writeHead(200, {
//             'Content-Type': 'text/event-stream',
//             'Content-Disposition': "attachment; filename=rfid_" + range_start + "_" + range_end + ".csv"
//           });
//           res.end(file);
//       });
//     }

//     else {
//       sails.log.debug("Attempting to get compliance data for ComplianceData#get_data");
//       //get the threshold first
//       // RfidAlerthandler.query("select rah.rfid, rah.config, r.organization, r.display_name, r.display_name_2 " +
//       // 	" from rfidalerthandler as rah join rfid as r on rah.rfid = r.id " +
//       // 	" where organization = ? order by r.id " + sort, req.session.organization, function (err, alerthandler_data) {
//       // 		if (err) {
// 	     //      sails.log.error("There was an error retrieving alerthandlers: " + err);
// 	     //      res.json({error: "Internal server error"}, 500);
// 	     //      return;
// 	     //    }
//       // 		//sails.log.info(JSON.stringify(alerthandlers));
//       // 		var array = []
//       // 		for(var index in alerthandler_data) {
//       // 			var config = JSON.parse(alerthandler_data[index].config);
//       // 			if(config.inverted_threshold) {
//       // 				RfidData.query("select rfidTagNum, timestamp, AVG(rfidTemperature) as avgTemp, VARIANCE(rfidTemperature) as varTemp, " +
//       // 				"count(*) as total, count(if(rfidTemperature > ?,rfidTemperature,NULL)) as passingTotal from rfiddata " +
//       // 				"where rfidTagNum = ? and timestamp >= ? and timestamp <= ? group by rfidTagNum",
//       // 				[config.threshold, alerthandler_data[index].rfid, range_start, range_end],
//       // 				function (err,data) {
//       // 					if (err) {
// 				  //         sails.log.error("There was an error retrieving Compliance data for rfid " + alerthandler_data[index].rfid + ": " + err);
// 				  //         res.json({error: "Internal server error"}, 500);
// 				  //         return;
// 				  //       }
// 				  //       //array.push(data);
// 				  //       res.json(JSON.stringify(data));
//       // 				});
//       // 			}
//       // 			else {
//       // 				RfidData.query("select rfidTagNum, timestamp, AVG(rfidTemperature) as avgTemp, VARIANCE(rfidTemperature) as varTemp, " +
//       // 				"count(*) as total, count(if(rfidTemperature < ?,rfidTemperature,NULL)) as passingTotal from rfiddata " +
//       // 				"where rfidTagNum = ? and timestamp >= ? and timestamp <= ? group by rfidTagNum",
//       // 				[config.threshold, alerthandler_data[index].rfid, range_start, range_end],
//       // 				function (err,data) {
//       // 					if (err) {
// 				  //         sails.log.error("There was an error retrieving Compliance data for rfid " + alerthandler_data[index].rfid + ": " + err);
// 				  //         res.json({error: "Internal server error"}, 500);
// 				  //         return;
// 				  //       }
// 				  //       sails.log.info(data)
// 				  //       res.json(JSON.stringify(data));
//       // 				});
//       // 			}
//       // 		}
//       // 		sails.log.info("Retrieved Compliance data for ComplianceData#get_data");
//       // 	});
//       RfidData.query("select rd.rfidTagNum, timestamp, AVG(rd.rfidTemperature) as avgTemp, VARIANCE(rd.rfidTemperature) as varTemp, " +
//         "count(*) as total, r.organization, r.display_name, r.display_name_2 " + 
//         "from rfiddata as rd join rfid as r on rd.rfidTagNum = r.id " +
//         "where timestamp >= ? and timestamp <= ? and organization = ? " + 
//         "group by r.id order by display_name " + sort, 
//         [range_start, range_end, req.session.organization], 
//         function (err, data) {
//         if (err) {
//           sails.log.error("There was an error retrieving Compliance data: " + err);
//           res.json({error: "Internal server error"}, 500);
//           return;
//         }

//         // Filter out RFIDs that aren't for the current user
//         data = data.filter(function (i) {
//           return i.rfidTagNum !== undefined && i.organization === req.session.organization;
//         });

//         sails.log.info("Retrieved Compliance data for ComplianceData#get_data");
//         //sails.log.info(JSON.stringify(data));
//         res.json(JSON.stringify(data));
//       });
//     }
//   },

  get_data: function(req, res) {
    var timeFilters = [];
    var rfidThresholds = {};
    var moment = require('moment');
    var defaultMoment = moment();
    for(var attributeName in req.query) {
      if(attributeName.indexOf("_threshold") == -1) {
        //It is timefilter, so we have [startTime, endTime, timezone]
        var startTime = moment.utc(req.query[attributeName][0] + " " + req.query[attributeName][2],"HH:mm Z")
                        .set("year",moment().get("year"))
                        .set("month", moment().get("month"))
                        .set("date", moment().get("date"));
        var endTime = moment.utc(req.query[attributeName][1] + " " + req.query[attributeName][2],"HH:mm Z")
                        .set("year",moment().get("year"))
                        .set("month", moment().get("month"))
                        .set("date", moment().get("date"));
        timeFilters.push([startTime.unix(),endTime.unix()]);
      } else {
        var response = attributeName.split("_");
        rfidThresholds[response[0]] = {"type": response[1], "threshold": req.query[attributeName]};
      }
    }

    //initialize some queue stuff
    var kue = require('kue');
    var jobQueue = kue.createQueue();

    //so now we have a list of time filters, and a list of each rfid and its threshold
    //first we create a row in the db so that we can query from it
    var util = require('util');

    Job.create({"job_type": "dbjob"}).exec(function (err, job_data) {
      if (err) {
        sails.log.error("Error saving job to database: " + util.inspect(err));
        res.json(JSON.stringify(err),500);
      }
      else {
        //now we need to put everything that we need into a a job, and send that into the queue
        var job = jobQueue.create('dbjob', {
          rfidThresholds: rfidThresholds,
          timeFilters: timeFilters,
          id: job_data.id
        });

        job.on('complete', function () {
          sails.log.info('Job', job.id, 'with name', job.data.name, 'is done');
        });
        job.on('failed', function () {
          sails.log.error('Job', job.id, 'with name', job.data.name, 'has  failed');
        });
        job.save();

        res.json(JSON.stringify(job_data));
      }
    });



    
    //once we send the jobs, want to store total jobs, a msgID for them so that
    //we can search through the reportdata table when all the jobs are done


  },

  get_settings: function(req, res) {
  	Compliance.find({organization: req.session.organization}).exec(function (err, compliance) {
  		if (err) {
  			sails.log.error("There was an error retrieving compliance data: " + err);
  			return;
  		}
  		Rfid.query("select rfid.id, display_name, display_name_2 from rfid " +
    		"left join rfidreportdata as rrd on rfid.id = rrd.rfid where organization = ? " +
        "order by display_name asc, display_name_2 asc",
    		[req.session.organization], function (err, rfidData) {
  			if (err) {
  				sails.log.error("There was an error retrieving rfid data: " + err);
  				return;
  			}
  			if (compliance.length === 0) {
  				//only send the rfid data
  				res.json(JSON.stringify(rfidData));
  			} else {
  				//we have both, combine to one json object and send it
  				res.json(JSON.stringify(compliance).concat(JSON.stringify(rfidData)));
  			}
		  });
  	});
  },

  save_settings: function(req,res) {

  }
};