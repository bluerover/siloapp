function TemperatureAboveX (event_bus, config, resume_data) {
  this.event_bus = event_bus;
  this.rfid = null;
  // this.first_email_alert = false;
  this.alert_fired = false;
  this.thresholds = config.threshold;
  for(var index in config.threshold) {
    this.thresholds.push({threshold: config.threshold[i], status: false});
  }
  this.last_reported = null;

  // this.tickHandler = function (timestamp) {
  //   var consecutive_time = this.time_until_alarm;
  //   this.last_tick = timestamp;

  //   if (this.alert_fired === false 
  //     && this.rfid !== null 
  //     && this.period_start_timestamp !== null) {
  //     var amount = (Math.round(this.last_tick/1000) - Math.round(this.period_start_timestamp/1000))/Math.round(consecutive_time/1000);
  //     if (amount < 1) {
  //       var sendEmail = false;
  //       if(amount > 0.75 && this.first_email_alert === false) {
  //         sendEmail = true;
  //         this.first_email_alert = true;
  //       }
  //       this.event_bus.emit("rfid-" + this.rfid, {status: "in-progress", message: 100 * amount, send: sendEmail});
  //     }
  //   }

  //   if (this.alert_fired === false
  //     && this.rfid !== null
  //     && this.period_start_timestamp !== null
  //     && this.last_tick - this.period_start_timestamp >= consecutive_time) {
  //     sails.log.info(this.rfid + 
  //       " has been above " + 
  //       this.max_temp + 
  //       "ºC for " + 
  //       this.time_until_alarm / 1000 + " seconds");
  //     this.event_bus.emit("rfid-" + this.rfid, {status: "alarm", message: 100, send: true});
  //     this.alert_fired = true;
  //   }
  // };

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
      for(var index in this.thresholds) {
        if(data.level <= this.thresholds[index].threshold) {
          this.thresholds[index].status = true;
          lowestThresholdIndex = index;
        }
      }
      var minThreshold = this.thresholds[lowestThresholdIndex].threshold;
      this.event_bus.emit("rfid-" + this.rfid, {status: "warning", threshold: minThreshold, send: true });
    }
  };

  this.resumeHandler = function () {
    for(var index in this.thresholds) {
      if(!this.thresholds[i].status && this.resume_data.level <= this.thresholds[i].threshold) {
        this.thresholds[i].status = true;
      }
    }
    sails.log.info("Successfully resumed alerthandler");
  };

  if (resume_data !== undefined && resume_data !== null &&
    'rfidTagNum' in resume_data && resume_data.rfidTagNum !== null &&
    'level' in resume_data && resume_data.status !== null &&
    'timestamp' in resume_data && resume_data.timestamp !== null) {
    this.resume_data = resume_data;
    this.rfid = resume_data.rfidTagNum;
    this.last_reported = resume_data.timestamp;
    this.resumeHandler();
  }
}

TemperatureAboveX.prototype.on = function (event, data) {
  switch(event) {
    case 'data':
    this.dataHandler(data);
    break;

    // case 'tick':
    // this.tickHandler(data);
    // break;
  }
}

module.exports = TemperatureAboveX;