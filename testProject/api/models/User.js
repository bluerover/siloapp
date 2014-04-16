/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Organization.findOne(attrs.organization).done(function (err, org) {
    if (err) return next(err);
    
    if (org === undefined) return next({
      error: "Organization ID " + attrs.organization + " does not exist."
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
    organization: {
      model: 'organization',
      required: true
    },
    first_name: {
      type: 'string',
      required: true
    },
    last_name: {
      type: 'string',
      required: true
    },
    is_admin: {
      type: 'boolean',
      defaultsTo: false
    },

    full_name: function() {
      return this.first_name + " " + this.last_name;
    }
    
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
