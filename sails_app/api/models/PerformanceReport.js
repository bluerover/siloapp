/**
 * PerformanceReport
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    organization: {
        model: 'organization'
    },
    
    kue_id: {
      type: 'integer'
    },

    name: {
      type: 'string'
    },

    result: {
      type: 'string'
    },
    
    status: {
      type: 'string',
      defaultsTo: "queued"
    }
  }

};
