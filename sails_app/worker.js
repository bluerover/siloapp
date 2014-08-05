var kue = require('kue');
var jobs = kue.createQueue();

var mysql = require('mysql');
var connection = null;
var connection2 = null;

var zlib = require('zlib');
var util = require('util');

var pool  = mysql.createPool({
  connectionLimit : 2,
  host     : 'localhost',
  port	   : 3306,
  user     : 'root',
  password : 'root',
  database : 'food_safety_app'
});

function startNewConnection() {
	if(connection) {
		console.log("destroying connection 1");
		connection.destroy();
	}
	if(connection2) {
		console.log("destroying connection 2");
		connection2.destroy();
	}
	pool.getConnection(function (err1, new_connection) {
		if(err1) {
			console.log(err1);
		 	setTimeout(function() {
		 		console.log("starting new connection");
		 		startNewConnection(); 
		 	},2000);	
		} else {
			pool.getConnection(function (err2, new_connection_2) {
				if(err2) {
					console.log(err2);
				 	setTimeout(function() {
				 		if(new_connection) {
				 			new_connection.release();
				 		}
				 		console.log("starting new connection");
				 		startNewConnection(); 
				 	},2000);	
				} else {
					connection = new_connection;
					connection2 = new_connection_2;

					connection.on('error', function() {
						connection = startNewConnection();
					});

					connection2.on('error', function() {
						connection2 = startNewConnection();
					});
				}
			});
		}
	});
}

startNewConnection();

var total = 0;
var count = 0;
var passNum = 0;
var jobErr = null;
var resultsArray = {};
var passPercentArray = {};

function updateKueId(kue_id, job_id) {
	var query = connection.query('UPDATE compliancereport SET kue_id = ?, status="in-progress" WHERE id = ?',
	  [kue_id, job_id], function(err, results) {
	  if(err) {
	  	console.log("couldn't update kue_id: " + err);
	  } else {
	  	console.log("successfully updated db row with kue_id");
	  }
	});
}

function getThresholdResult(startTime, endTime, rfid, threshold, thresholdType) {
	var queryString = "SELECT r.id, r.display_name, r.display_name_2, ROUND(AVG(rfidTemperature),2) as avgTemp, ROUND(VARIANCE(rfidTemperature),2) as varTemp, " +
        "count(*) as total, COUNT(IF(rfidTemperature " + (thresholdType === "min" ? "<" : ">") + " ? ,1, NULL)) " +
        "as passingTemp, " + threshold + " as threshold FROM rfiddata as rd JOIN rfid as r on rd.rfidTagNum = r.id  " +
        "WHERE rfidTagNum = ? AND timestamp >= ? AND timestamp <= ?";
    var parameters = [threshold, rfid, startTime, endTime];
    var query = connection.query(queryString,parameters, function(err, results) {
    	if(err) {
    		jobErr = new Error(err);
    	} else {
    		if((results[0]["passingTemp"]/results[0]["total"]).toPrecision(3) >= passPercentArray[results[0]["id"]]) {
    			results[0]["result"] = "PASS";
    			passNum++;
    		} else {
    			results[0]["result"] = "FAIL";
    		}
    		resultsArray[startTime + "_" + endTime].push(results[0]);
    		count++;
    	}
    });
}

function saveComplianceReport(resultsArray, job_id, status, callback) {
	zlib.deflate(JSON.stringify(resultsArray), function(err, buffer) {
	  if (err) {
	    jobErr = new Error(err);
	  }
	  else {
	  	var query = connection.query('UPDATE compliancereport SET status="' + status + '", result = ? WHERE id = ?',
		[total === 0 ? "0/0" : util.format('%s/%s  %d %',passNum, total, (passNum/total).toPrecision(3)*100), job_id], function(err, results) {
		  	if(err) {
		  		jobErr = err;
		  		errBack(callback,err);
		  	} else {
		  		var fs = require('fs');
		  		fs.appendFile('/reports/' + job_id + '_report.log', buffer.toString('base64'), function (err) {
			      if(err) {
			        console.log("couldn't write report " + job_id + " to file: " + err);
			      } else {
			        console.log("write to /reports/" + job_id + "_report.log successful");
			      }
			      callback();
			    });
		  	}
		});
	  }
	});
}

function getJobStatus(job_id, callback) {
	var query = connection2.query('SELECT status FROM compliancereport WHERE id = ?',
	  job_id, function(err, data) {
	  if(err) {
	  	console.log("couldn't find job with id #" + job_id + ": " + err);
	  } else {
	  	callback(data[0]["status"]);
	  }
	});
}

function errBack(done, err) {
	done(err);
}

jobs.process('compjob', function (job, done) {
	console.log("Processing job " + job.data.id + ", kueID " + job.id); 

	//First, update row in db with the kueID here
	updateKueId(job.id, job.data.id);
	count = 0;
	total = 0;
	passNum = 0;
	jobErr = null;
	passPercentArray = {};
	resultsArray = {};

	//Then we need to split things up based on rfid, and apply each time filter to it
	for(var filter in job.data.timeFilters) {
		resultsArray[job.data.timeFilters[filter][0] + "_" + job.data.timeFilters[filter][1]] = [];
		for(var rfid in job.data.rfidThresholds) {
			passPercentArray[rfid] = (job.data.rfidThresholds[rfid]["passPercent"]/100).toPrecision(3);
			getThresholdResult(job.data.timeFilters[filter][0],
							   job.data.timeFilters[filter][1],
							   rfid,
							   job.data.rfidThresholds[rfid]["threshold"],
							   job.data.rfidThresholds[rfid]["thresholdType"]);
			total++;
		}
	}

	var id = setInterval(function() {
		if(jobErr) {
			console.log("failed");
			clearInterval(id);
			saveComplianceReport({},job.data.id,"failed",function(){});
			errBack(done,jobErr);
		}
		else if(count < total) {
			console.log(count + "/" + total);
			job.progress(count,total);

			getJobStatus(job.data.id, function (status) {
				console.log(status);
				if(status !== "in-progress") {
					clearInterval(id);
					startNewConnection();
					done();
				}		
			});
		}
		else {
			console.log("done");
			clearInterval(id);
			saveComplianceReport(resultsArray,job.data.id,"complete",done);
		}
	},800);
});

console.log("Compliance worker started");
