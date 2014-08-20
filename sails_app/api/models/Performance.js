/**
 * Performance
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
    timefilters: {
      type: 'string',
      maxLength: 3000
    },
    thresholds: {
      type: 'string',
      maxLength: 5000
    }

  }

};
