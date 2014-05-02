/**
 * RfidData
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  // This tells sails not to migrate this model (I manually set id to be a BIGINT in the database)
  // https://github.com/balderdashy/sails-mysql/issues/32
  // As a result of this, any modifications to this model will have to be manually mirrored in the DB
  migrate: 'safe',

  attributes: {
    accountID: 'string',
    deviceID: 'string',
    timestamp: 'integer',
    statusCode: 'integer',
    rfidTagNum: {
        model: 'rfid'
    },
    rfidTemperature: 'float',
    latitude: 'float',
    longitude: 'float',
    speedKPH: 'float',
    zone1Avg: 'float',
    zone2Avg: 'float',
    zone3Avg: 'float',
    zone4Avg: 'float',
    zone5Avg: 'float',
    zone6Avg: 'float',
    zone7Avg: 'float'
    
  }

};
