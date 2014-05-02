/**
 * Rfid
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    display_name: {
        type: 'string',
        required: true
    },
    display_name_2: 'string',
    organization: {
        model: 'organization'
    },
    rfiddata: {
        collection: 'rfiddata',
        via: 'rfidTagNum'
    }
    
  }

};
