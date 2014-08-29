function MinThreshold (event_bus, config, resume_data) {
  this.event_bus = event_bus;
  this.rfid = null;
  this.alert_fired = false;
  this.thresholds = [];
  for(var i in config.threshold) {
    this.thresholds.push({threshold: config.threshold[i], status: false});
  }
  this.last_reported = null;

  this.dataHandler = function (data) {
    if (this.rfid === null) {
      this.rfid = data.rfidTagNum;
    }
    this.last_reported = data.timestamp;

    if (data.level > this.thresholds[0].threshold) {
      this.event_bus.emit("rfid-" + this.rfid, {status: "ok", threshold: null, send: false});
      for(var index in this.thresholds) {
        this.thresholds[index].status = false;
      }
    }
    else {
      
      //how many thresholds did it break? let's find out
      var lowestThresholdIndex = 0;
      var send = false;
      for(var index in this.thresholds) {
        if(data.level <= this.thresholds[index].threshold) {
          if(!this.thresholds[index].status) {
            send = true;
          }
          this.thresholds[index].status = true;
          lowestThresholdIndex = index;
        }
      }
      var minThreshold = this.thresholds[lowestThresholdIndex].threshold;
      this.event_bus.emit("rfid-" + this.rfid, {status: "warning", threshold: minThreshold, send: send });
    }
  };

  this.resumeHandler = function () {
    for(var i in this.thresholds) {
      if(this.resume_data.threshold <= this.thresholds[i].threshold) {
        this.thresholds[i].status = true;
      }
    }
    sails.log.info("Successfully resumed alerthandler");
  };

  if (resume_data !== undefined && resume_data !== null &&
    'rfidTagNum' in resume_data && resume_data.rfidTagNum !== null &&
    'threshold' in resume_data && resume_data.threshold !== null &&
    'status' in resume_data && resume_data.status !== null &&
    'timestamp' in resume_data && resume_data.timestamp !== null) {
    this.resume_data = resume_data;
    this.rfid = resume_data.rfidTagNum;
    this.last_reported = resume_data.timestamp;
    this.resumeHandler();
  }
}

MinThreshold.prototype.on = function (event, data) {
  switch(event) {
    case 'data':
    this.dataHandler(data);
    break;
  }
}

module.exports = MinThreshold;