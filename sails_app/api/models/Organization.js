/**
 * Organization
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
    auth_token: 'string',
    children: {
      collection: 'organization',
      via: 'parent'
    },
    parent: {
      model: 'organization'
    },
    farms: {
      collection: 'Farm',
      via: 'organization'
    },
    products: {
      collection: 'Product',
      via: 'organization'
    },
    users: {
      collection: 'user',
      via: 'organization'
    }
    
  },

  beforeCreate: function(attrs, next) {
    var uuid = require('node-uuid');
    attrs.auth_token = uuid.v4();
    return next();
  }

};
