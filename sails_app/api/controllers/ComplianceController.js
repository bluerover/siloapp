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

  save_as_csv: function(req, res) {
    var data = JSON.parse(req.query.data);
    var moment = require('moment');
    var file = "Asset Name,Sensor Type,Threshold";
    var dummyTimeFrame = "";
    for(var timeframe in data) {
        dummyTimeFrame = timeframe;
        var times = timeframe.split("_");
        var headerString = "," + moment.unix(times[0]).format("MMM DD YYYY h:mm Z") + " - ";
        headerString += moment.unix(times[1]).format("MMM DD YYYY h:mm Z");
        file += headerString + " Avg";
        file += headerString + " Var";
        file += headerString + " Temps Pass";
        file += headerString + " % Pass";
    }
    file += "\n";
    for(var asset in data[dummyTimeFrame]) {
        var tmpText = "";
        tmpText += data[dummyTimeFrame][asset].display_name + ",";
        tmpText += data[dummyTimeFrame][asset].display_name_2 + ",";
        tmpText += data[dummyTimeFrame][asset].threshold + ",";
        for(var timeframe in data) {
            tmpText += data[timeframe][asset].avgTemp + ",";
            tmpText += data[timeframe][asset].varTemp + ",";
            tmpText += data[timeframe][asset].passingTemp + "/" + data[timeframe][asset].total + ",";
            tmpText += (data[timeframe][asset].passingTemp/data[timeframe][asset].total).toFixed(2) + ",";
        }
        tmpText = tmpText.slice(0,-1) + "\n";
        file += tmpText;
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Content-Disposition': "attachment; filename=compliance_report.csv"
    });
    res.end(file);
  },

  get_data: function(req, res) {
    var timeFilters;
    var rfidThresholds = {};
    var moment = require('moment');
    for(var attributeName in req.query) {
      if(attributeName.indexOf("_threshold") == -1) {
        //It is timefilter, so we have [[startTime, endTime], [startTime, endTime]...]
        timeFilters = req.query[attributeName];
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

    ComplianceReport.create({"job_type": "dbjob"}).exec(function (err, job_data) {
      if (err) {
        sails.log.error("Error saving job to database: " + err);
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
  },

  get_settings: function(req, res) {
  	Compliance.find({organization: req.session.organization}).sort('createdAt desc').exec(function (err, compliance) {
  		if (err) {
  			sails.log.error("There was an error retrieving compliance data: " + err);
  			return;
  		}
  		Rfid.query("select rfid.id, display_name, display_name_2 from rfid " +
    		"left join rfidcompliancethreshold as rct on rfid.id = rct.rfid where organization = ? " +
        "order by display_name asc, display_name_2 asc",
    		[req.session.organization], function (err, rfidData) {
  			if (err) {
  				sails.log.error("There was an error retrieving rfid data: " + err);
  				return;
  			}
  			if (compliance.length === 0) {
  				//only send the rfid data
  				res.json("{\"rfids\" : " + JSON.stringify(rfidData) + "}");
  			} else {
  				//we have both, combine to one json object and send it
  				res.json("{\"compliance\" : " + JSON.stringify(compliance) + "," +
                   " \"rfids\" : " + JSON.stringify(rfidData) + "}");
  			}
		  });
  	});
  },

  save_settings: function(req,res) {
    //get the data, add the organization to json object, put it in compliance
    timeFilters = req.query["timeFilters"];
    delete req.query["timeFilters"];

    Compliance.create({organization: req.session.organization, timefilters: JSON.stringify(timeFilters),
                       thresholds: JSON.stringify(req.query)}).exec(function (err, complianceData) {
      if (err) {
        sails.log.error("Error saving compliance data to database: " + err);
        res.json({"error": err}, 500);
      }
      else {
       sails.log.info("Compliance data saved in database");
       res.json({},200);
      }
    });
  },

  poll_job: function(req,res) {
    ComplianceReport.findOne({id: req.query.job_id}).exec(function (err, reportData) {
      if (err) {
        sails.log.error("Error retrieving job from database: " + err);
        res.json(JSON.stringify(err),500);
      }
      if(reportData.status === 'in-progress') {
        //figure out how to poll kue for the status of the job
        res.json(JSON.stringify(reportData));
      } else {
        var zlib = require('zlib');
        zlib.unzip(new Buffer(reportData.report,'base64'), function(err,buffer) {
          if (err) {
            sails.log.error("Error with gzip: " + err);
            res.json(JSON.stringify(err),500);
          }
          res.json(JSON.stringify(buffer.toString()));
        });
      }
    });
  }
};