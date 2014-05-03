/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Dashboard.findOne(attrs.dashboard).exec(function (err, dashboard) {
    if (err) return next(err);

    if (dashboard === undefined) return next({
      error: "Dashboard ID " + attrs.dashboard + " does not exist."
    });

    Widget.findOne(attrs.widget).exec(function (err, widget) {
      if (err) return next(err);

      if (widget === undefined) return next({
        error: "Widget ID " + attrs.widget + " does not exist."
      });

      return next();
    });
  });
}

module.exports = {

  attributes: {

    dashboard: {
      model: 'dashboard',
      required: true
    },
    widget: {
      model: 'widget',
      required: true
    },
    data_filter: {
      type: 'string',
      required: true,
      maxLength: 3000,
      size: 3000
    },
    options: {
      type: 'string',
      maxLength: 5000,
      size: 5000
    },
    display_name: {
      type: 'string'
    },
    display_name_2: {
      type: 'string'
    },
    widget_order: {
      type: 'integer'
    }

    
  },

  beforeValidation: function (attrs, next) {
    return verifyAssociations(attrs, next);
  }

};
