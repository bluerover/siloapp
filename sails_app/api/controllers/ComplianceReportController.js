/**
 * ComplianceReportController
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
        var moment = require('moment');
        var data = JSON.parse(buffer.toString());
        if(req.query.task === "table") {
          res.json(JSON.stringify(data));
        } else if(req.query.task === "csv") {
          var file = "Asset Name,Sensor Type,Threshold (ºC),Pass Criteria (%)";
          for(var timeframe in data) {
            dummyTimeFrame = timeframe;
            var times = timeframe.split("_");
            var headerString = "," + moment.unix(times[0]).format("MMM DD YYYY h:mm") + " - ";
            headerString += moment.unix(times[1]).format("MMM DD YYYY h:mm");
            file += headerString + " Average (ºC)";
            file += headerString + " Variance (ºC)";
            file += headerString + " Temps Passed";
            file += headerString + " Temps Failed";
            file += headerString + " Percentage Passed (%)";
            file += headerString + " Result";
          }
          file += "\n";
          for(var asset in data[dummyTimeFrame]) {
            var tmpText = "";
            tmpText += data[dummyTimeFrame][asset].display_name + ",";
            tmpText += data[dummyTimeFrame][asset].display_name_2 + ",";
            tmpText += data[dummyTimeFrame][asset].threshold + ",";
            tmpText += data[dummyTimeFrame][asset].passCriteria*100 + ",";
            for(var timeframe in data) {
              tmpText += data[timeframe][asset].avgTemp + ",";
              tmpText += data[timeframe][asset].varTemp + ",";
              tmpText += data[timeframe][asset].passingTemp + ",";
              tmpText += (data[timeframe][asset].total - data[timeframe][asset].passingTemp) + ",";
              tmpText += Math.round(data[timeframe][asset].passingTemp/data[timeframe][asset].total*100*100)/100 + "%,";
              tmpText += data[timeframe][asset].result + ",";
            }
            tmpText = tmpText.slice(0,-1) + "\n";
            file += tmpText;
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

    var timeFilters = req.query["timeFilters"];
    var jobName = req.query["jobName"];
    delete req.query["timeFilters"];
    delete req.query["jobName"];

    var kue = require('kue');
    var jobQueue = kue.createQueue();
    ComplianceReport.create({"organization": req.session.organization, "name": jobName}).exec(function (err, job_data) {
      if (err) {
        sails.log.error("Error saving job to database: " + err);
        res.json(JSON.stringify(err),500);
      }
      else {
        var job = jobQueue.create('compjob', {
          rfidThresholds: req.query,
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
      try {
        var kue = require('kue');
        kue.Job.get(reportData.kue_id, function(err, kuejob) {
          if(err) {
            sails.log.error("Error retrieving job from kue: " + err);
            res.json(JSON.stringify(err),500);
            return;
          }
          if(kuejob._state !== 'complete') {
            kuejob.failed(function() { console.log("killed job")});  
          }
        });
      } catch(e) {
        //ignore, it passed anyways
      } finally {
        ComplianceReport.destroy({id: req.query.job_id}, function (err, reports) {
          if(err) {
            sails.log.error("Error setting status of compliance report: " + err);
            res.json(JSON.stringify(err),500);
          } else {
            var fs = require('fs');
            path = '/reports/' + reports[0].id + "_report.log";
            if(fs.existsSync(path)) {
              fs.unlinkSync(path);
            }
            res.json(JSON.stringify({id: req.query.job_id}));
          }
        });
      }
    });
  },

  queued_jobs: function(req,res) {
    ComplianceReport.find({ where: {organization: req.session.organization}, sort: 'createdAt desc', limit: 5, skip: 5*req.query.page}).exec(function (err, jobList) {
      if (err) {
        sails.log.error("Error retrieving jobs from database: " + err);
        res.json(JSON.stringify(err),500);
      }
      else if(jobList.length === 0) {
        res.json(null);
      }
      res.json(JSON.stringify(jobList));
    });
  },
};
