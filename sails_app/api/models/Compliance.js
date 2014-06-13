/**
 * Compliance
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    start_time: {
      type: 'integer',
      required: true
    },
    end_time: {
      type: 'integer',
      required: true
    },
    timezone: {
      type: 'string',
      required: true
    },
    organization: {
        model: 'organization'
    }

  }

};
