/* simple-worker.js */
var kue = require('kue');
var jobs = kue.createQueue();

var mysql = require('mysql');
var connection = null;

var zlib = require('zlib');

function startNewConnection() {
	if(connection === undefined || !(connection)) {
		connection = mysql.createConnection({
		  host     : 'localhost',
		  port	   : 3306,
		  user     : 'root',
		  password : 'root',
		  database : 'food_safety_app'
		});
	}

	connection.on('error', function(err) {
	 	console.log(err);
	 	setTimeout(function() {
	 		connection = null;
	 		console.log("starting new connection");
	 		startNewConnection(); 
	 	},2000);
	});
}

startNewConnection();

var total = 0;
var count = 0;
var jobErr = null;
var resultsArray = {};

function updateKueId(kue_id, job_id) {
	var query = connection.query('UPDATE compliancereport set kue_id = ? where id = ?',
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
        "count(*) as total, COUNT(IF(rfidTemperature " + (thresholdType == "min" ? ">" : "<") + " ? ,1, NULL)) " +
        "as passingTemp, " + threshold + " as threshold FROM rfiddata as rd JOIN rfid as r on rd.rfidTagNum = r.id  " +
        "WHERE rfidTagNum = ? AND timestamp >= ? AND timestamp <= ?";
    var parameters = [threshold, rfid, startTime, endTime];
    var query = connection.query(queryString,parameters, function(err, results) {
    	if(err) {
    		jobErr = new Error(err);
    	} else {
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
	  	var query = connection.query('UPDATE compliancereport set status=' + status + ', report = ? where id = ?',
		[buffer.toString('base64'), job_id], function(err, results) {
		  	if(err) {
		  		jobErr = err;
		  		errBack(callback,err);
		  	} else {
		  		callback();
		  	}
		});
	  }
	});
}

function errBack(done, err) {
	done(err);
}

jobs.process('dbjob', function (job, done) {
	console.log("Processing job " + job.data.id + ", kueID " + job.id); 

	//First, update row in db with the kueID here
	updateKueId(job.id, job.data.id);
	count = 0;
	total = 0;
	jobErr = null;
	resultsArray = {};
	//Then we need to split things up based on rfid, and apply each time filter to it
	for(var filter in job.data.timeFilters) {
		resultsArray[job.data.timeFilters[filter][0] + "_" + job.data.timeFilters[filter][1]] = [];
		for(var rfid in job.data.rfidThresholds) {
			getThresholdResult(job.data.timeFilters[filter][0],
							   job.data.timeFilters[filter][1],
							   rfid,
							   job.data.rfidThresholds[rfid]["threshold"],
							   job.data.rfidThresholds[rfid]["type"]);
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
		}
		else {
			console.log("done");
			clearInterval(id);
			saveComplianceReport(resultsArray,job.data.id,"complete",done);
		}
	},800);
});

kue.app.listen(3000);
console.log("worker started, UI @ 3000");
