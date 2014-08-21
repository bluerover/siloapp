/**
 * SiloData
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  // This tells sails not to migrate this model (I manually set id to be a BIGINT in the database)
  // https://github.com/balderdashy/sails-mysql/issues/32
  // As a result of this, any modifications to this model will have to be manually mirrored in the DB
  migrate: 'safe',
  
  attributes: {
    accountID: 'string',
    deviceID: 'string',
    statusCode: 'integer',
    silo: {
        model: 'silo'
    },
    
    rfidTagNum: 'integer',
    rawData: 'string',
    timestamp: 'integer',
  }

};
