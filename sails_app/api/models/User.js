/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function (attrs, next) {
  Farm.findOne(attrs.farm).exec(function (err, farm) {
    if (err) return next(err);
    
    if (farm === undefined) return next({
      error: "Farm ID " + attrs.farm + " does not exist."
    });

    return next();
  });
};

var passwordEncrypt = function (attrs, next) {
  var bcrypt = require('bcrypt');

  bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function (err, hash) {
          if (err) return next(err);

          attrs.password = hash;
          next();
      });
  });
};

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
    first_name: {
      type: 'string',
      required: true
    },
    last_name: {
      type: 'string',
      required: true
    },
    is_alert_active: {
      type: 'boolean',
      defaultsTo: false
    },
    roles: {
      collection: 'role',
      via: 'user'
    },
    organization: {
      model: 'Organization'
    },
    
    full_name: function() {
      return this.first_name + " " + this.last_name;
    }
    
  },

  beforeValidation: function(attrs, next) {
    return verifyAssociations(attrs, next);
  },

  beforeCreate: function (attrs, next) {
    return passwordEncrypt(attrs, next);
  },

  beforeUpdate: function (attrs, next) {
    return passwordEncrypt(attrs, next);
  }

};
