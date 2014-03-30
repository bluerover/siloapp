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
    auth_token: 'string'
    
  },

  beforeCreate: function(attrs, next) {
    var uuid = require('node-uuid');
    attrs.auth_token = uuid.v4();
    return next();
  }

};
