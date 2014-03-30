/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Organization.findOne(attrs.organization_id).done(function (err, org) {
    if (err) return next(err);
    
    if (org === undefined) return next({
      error: "Organization ID " + attrs.organization_id + " does not exist."
    });

    return next();
  });
}

module.exports = {

  attributes: {

    username: {
      type: 'string',
      unique: true,
      required: true,
      maxLength: 64
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    organization_id: {
      type: 'integer',
      required: true
    },
    first_name: 'string',
    last_name: 'string',
    is_admin: 'boolean'
    
  },

  beforeValidation: function(attrs, next) {
    return verifyAssociations(attrs, next);
  },

  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(attrs.password, salt, function (err, hash) {
            if (err) return next(err);

            attrs.password = hash;
            next();
        });
    });
  }

};
