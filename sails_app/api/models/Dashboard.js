/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Organization.findOne(attrs.organization).exec(function (err, org) {
    if (org === undefined) return next({
      error: "Organization ID " + attrs.organization + " does not exist."
    });

    return next();
  });
}

module.exports = {

  attributes: {

    organization: {
      model: 'organization',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    dashboard_widgets: {
      collection: 'dashboard_widget',
      via: 'dashboard'
    }
    
  },

  beforeValidation: function (attrs, next) {
    return verifyAssociations(attrs, next);
  }

};
