/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Organization.findOne(attrs.organization_id).done(function (err, org) {
    if (org === undefined) return next({
      error: "Organization ID " + attrs.organization_id + " does not exist."
    });

    return next();
  });
}

module.exports = {

  attributes: {

    organization_id: {
      type: 'integer',
      required: true
    },
    name: {
      type: 'string',
      required: true
    }
    
  },

  beforeValidation: function (attrs, next) {
    return verifyAssociations(attrs, next);
  }

};
