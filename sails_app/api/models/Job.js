/**
 * Job
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    job_type: {
      type: 'string',
      required: true
    },

    kue_id: {
      type: 'integer'
    }

  }

};
