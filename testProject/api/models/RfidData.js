/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    account_id: 'integer',
    device_id: 'string',
    timestamp: 'integer',
    status_code: 'integer',
    rfid: 'integer',
    temperature: 'integer',
    latitude: 'float',
    longitude: 'float',
    speed: 'float',
    zone_1_avg: 'float',
    zone_2_avg: 'float',
    zone_3_avg: 'float',
    zone_4_avg: 'float',
    zone_5_avg: 'float',
    zone_6_avg: 'float',
    zone_7_avg: 'float'
    
  }

};
