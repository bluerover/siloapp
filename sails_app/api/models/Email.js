/**
 * Email
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	username: {
      type: 'string',
      required: true,
    },
    email_address: {
      type: 'email',
      required: true
    },
    rfid: {
      type: 'integer',
      required: true
    },
    alarm_status: 'string',
    email_status: 'string'
  }

};
