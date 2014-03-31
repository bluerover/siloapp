/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    accountID: 'integer',
    deviceID: 'string',
    timestamp: 'integer',
    statusCode: 'integer',
    rfidTagNum: 'integer',
    rfidTemperature: 'integer',
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
