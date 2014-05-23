function TemperatureAboveX (event_bus, config, resume_data) {
  this.event_bus = event_bus;
  this.period_start_timestamp = null;
  this.last_tick = this.period_start_timestamp;
  this.rfid = null;
  this.first_email_alert = false;
  this.alert_fired = false;
  this.max_temp = config.threshold;
  this.time_until_alarm = config.time_until_alarm || 2 * 60 * 60 * 1000;

  this.tickHandler = function (timestamp) {
    var consecutive_time = this.time_until_alarm;
    this.last_tick = timestamp;

    if (this.alert_fired === false 
      && this.rfid !== null 
      && this.period_start_timestamp !== null) {
      var amount = (Math.round(this.last_tick/1000) - Math.round(this.period_start_timestamp/1000))/Math.round(consecutive_time/1000);
      if (amount < 1) {
        var sendEmail = false;
        if(amount > 0.75 && this.first_email_alert === false) {
          sendEmail = true;
          this.first_email_alert = true;
        }
        this.event_bus.emit("rfid-" + this.rfid, {status: "in-progress", message: 100 * amount, send: sendEmail});
      }
    }

    if (this.alert_fired === false
      && this.rfid !== null
      && this.period_start_timestamp !== null
      && this.last_tick - this.period_start_timestamp >= consecutive_time) {
      sails.log.info(this.rfid + 
        " has been above " + 
        this.max_temp + 
        "ºC for " + 
        this.time_until_alarm / 1000 + " seconds");
      this.event_bus.emit("rfid-" + this.rfid, {status: "alarm", message: 100, send: true});
      this.alert_fired = true;
    }
  };

  this.dataHandler = function (data) {
    if (this.rfid === null) {
      this.rfid = data.rfidTagNum;
    }

    if (data.rfidTemperature <= this.max_temp) {
      this.period_start_timestamp = null;
      this.event_bus.emit("rfid-" + this.rfid, {status: "ok"});
      this.alert_fired = false;
      this.first_email_alert = false;
    }
    else {
      if (this.period_start_timestamp === null) {
        this.period_start_timestamp = new Date().getTime();
      }
    }
  };

  this.resumeHandler = function () {
    this.period_start_timestamp = null;
    if (this.resume_data.status === 'alarm') {
      this.period_start_timestamp = (this.resume_data.timestamp * 1000) - this.time_until_alarm;
      this.alert_fired = true;
      this.first_email_alert = true;
    }
    else if (this.resume_data.status === 'in-progress') {
      var percent = parseFloat(this.resume_data.message / 100);
      var time_into = Math.floor(this.time_until_alarm * percent);
      this.period_start_timestamp = (this.resume_data.timestamp * 1000) - time_into;
      if (percent > 0.75) {
        this.first_email_alert = true;
      }
    }

    this.tickHandler(new Date().getTime());
    sails.log.info("Successfully resumed alerthandler");
  };

  if (resume_data !== undefined && resume_data !== null &&
    'rfidTagNum' in resume_data && resume_data.rfidTagNum !== null &&
    'message' in resume_data &&
    'status' in resume_data && resume_data.status !== null &&
    'timestamp' in resume_data && resume_data.timestamp !== null) {
    this.resume_data = resume_data;
    this.rfid = resume_data.rfidTagNum;
    this.resumeHandler();
  }
}

TemperatureAboveX.prototype.on = function (event, data) {
  switch(event) {
    case 'data':
    this.dataHandler(data);
    break;

    case 'tick':
    this.tickHandler(data);
    break;
  }
}

module.exports = TemperatureAboveX;