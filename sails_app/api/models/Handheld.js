/**
 * Handheld.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    device_id: {
        type: 'string',
        required: true
    },
    organization: {
        model: 'organization'
    },
    handhelddata: {
      collection: 'handhelddata',
      references: 'handhelddata',
      on: 'device_id',
      via: 'device_id'
    }
    
  }

};
