/**
 * ComplianceReport
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

    report: {
      type: 'string',
      maxLength: 5000,
      size: 5000
    },

    status: {
      type: 'string',
      defaultsTo: "queued"
    }
  }

};
