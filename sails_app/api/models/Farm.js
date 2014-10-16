/**
 * Farm
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    bins: {
      collection: 'bin',
      via: 'farm'
    },
    region: {
      model: 'region'
    },
    organization: {
      model: 'Organization'
    },
    location: 'string',
    address: 'string'
	    
  },

};
