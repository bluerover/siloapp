/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var verifyAssociations = function(attrs, next) {
  Dashboard.findOne(attrs.dashboard_id).done(function (err, dashboard) {
    if (err) return next(err);

    if (dashboard === undefined) return next({
      error: "Dashboard ID " + attrs.dashboard_id + " does not exist."
    });

    Widget.findOne(attrs.widget_id).done(function (err, widget) {
      if (err) return next(err);

      if (widget === undefined) return next({
        error: "Widget ID " + attrs.dashboard_id + " does not exist."
      });

      return next();
    });
  });
}

module.exports = {

  attributes: {

    dashboard_id: {
      type: 'integer',
      required: true
    },
    widget_id: {
      type: 'integer',
      required: true
    },
    data_filter: {
      type: 'string',
      required: true,
      maxLength: 3000
    },
    custom_attributes: {
      type: 'string',
      maxLength: 5000
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
