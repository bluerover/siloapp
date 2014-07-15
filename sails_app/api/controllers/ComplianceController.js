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

  get_report: function(req, res) {
    var fs = require('fs');
    fs.readFile('/reports/' + req.query.job_id + '_report.log', 'utf-8', function (err,reportData) {
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
        if(req.query.csv === "false") {
          res.json(JSON.stringify(buffer.toString()));  
        } else {
          var data = JSON.parse(buffer.toString());
          var moment = require('moment');
          var file = "Timeframe,Asset Name,Sensor Type,Threshold,Average,Variance,Temps Pass,% Pass\n";
          for (var timeframe in data) {
            var times = timeframe.split("_");
            var timeString = moment.unix(times[0]).format("MMM DD YYYY h:mmA Z") + " - " + moment.unix(times[1]).format("MMM DD YYYY h:mmA Z") + ",";
            for(var asset in data[timeframe]) {
              var tmpText = timeString;
              tmpText += data[timeframe][asset].display_name + ",";
              tmpText += data[timeframe][asset].display_name_2 + ",";
              tmpText += data[timeframe][asset].threshold + ",";
              tmpText += data[timeframe][asset].avgTemp + ",";
              tmpText += data[timeframe][asset].varTemp + ",";
              tmpText += data[timeframe][asset].passingTemp + "/" + data[timeframe][asset].total + ",";
              tmpText += (data[timeframe][asset].passingTemp/data[timeframe][asset].total).toFixed(2) + "\n";
              file += tmpText;
            }
          }
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Content-Disposition': "attachment; filename=compliance_report.csv"
          });
          res.end(file);      
        }
      });
    });
  },

  queue_job: function(req, res) {
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

    var kue = require('kue');
    var jobQueue = kue.createQueue();
    
    ComplianceReport.create({"job_type": "dbjob", "organization": req.session.organization}).exec(function (err, job_data) {
      if (err) {
        sails.log.error("Error saving job to database: " + err);
        res.json(JSON.stringify(err),500);
      }
      else {
        var job = jobQueue.create(req.session.organization + '_compjob', {
          rfidThresholds: rfidThresholds,
          timeFilters: timeFilters,
          id: job_data.id
        });

        job.on('complete', function () {
          sails.log.info('Job', job.id, 'with name', job.data.name, 'is done');
        });
        job.on('failed', function () {
          sails.log.error('Job', job.id, 'with name', job.data.name, 'has failed');
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
    		"where organization = ? order by display_name asc, display_name_2 asc",
    		[req.session.organization], function (err, rfidData) {
  			if (err) {
  				sails.log.error("There was an error retrieving rfid data: " + err);
  				return;
  			}
  			if (compliance.length === 0) {
  				//only send the rfid data
  				res.json("{\"rfids\" : " + JSON.stringify(rfidData) + "}");
  			} else {
  				// we have both, combine to one json object and send it
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
      if(reportData.status === 'queued') {
        res.json(JSON.stringify(reportData));
      }
      else if(reportData.status === 'in-progress') {
        if(reportData.kue_id !== undefined) {
          var kue = require('kue');
          kue.Job.get(reportData.kue_id, function(err, kuejob) {
            if(err) {
              sails.log.error("Error retrieving job from kue: " + err);
              ComplianceReport.update({id: reportData.id}, {status: "cancelled"}, function (err, reports) {
                if(err) {
                  sails.log.error("Error setting status of compliance report: " + err);
                  res.json(JSON.stringify(err),500);
                }
                res.json(JSON.stringify(reports[0]),500);
              });
            } else {
              res.json(JSON.stringify({"status": "in-progress", "job" : kuejob, "id" : reportData.id}));
            }
          });
        } else {
          res.json(JSON.stringify(reportData));
        }
      } else if(reportData.status === 'failed' || reportData.status === 'cancelled') {
        res.json(JSON.stringify({"status": reportData.status, "id": reportData.id}, 500));
      } else {
        res.json(JSON.stringify(reportData));
      }
    });
  },

  kill_job: function(req,res) {
    ComplianceReport.findOne({id: req.query.job_id}).exec(function (err, reportData) {
      if (err) {
        sails.log.error("Error retrieving job from database: " + err);
        res.json(JSON.stringify(err),500);
      }
      var kue = require('kue');
      kue.Job.get(reportData.kue_id, function(err, kuejob) {
        if(err) {
          sails.log.error("Error retrieving job from kue: " + err);
          res.json(JSON.stringify(err),500);       
        }
        kuejob.failed(function() {
          ComplianceReport.update({id: req.query.job_id}, {status: "cancelled"}, function (err, reports) {
            if(err) {
              sails.log.error("Error setting status of compliance report: " + err);
              res.json(JSON.stringify(err),500);
            }
            res.json(JSON.stringify({id: req.query.job_id}));
          });
        });  
      });
    });
  },

  queued_jobs: function(req,res) {
    ComplianceReport.find({ where: {organization: req.session.organization}, limit: 5, skip: 5*req.query.page}).exec(function (err, jobList) {
      if (err) {
        sails.log.error("Error retrieving jobs from database: " + err);
        res.json(JSON.stringify(err),500);
      }
      else if(jobList.length === 0) {
        res.json(null);
      }
      res.json(JSON.stringify(jobList));
    });
  }
};