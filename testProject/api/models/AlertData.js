/**
 * AlertData
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    rfidTagNum: {
        type: 'integer',
        required: true
    },
    alerthandler_name: {
        type: 'string',
        required: true
    },
    message: 'string',
    status: 'string',
    timestamp: 'integer'
    
  }

};
