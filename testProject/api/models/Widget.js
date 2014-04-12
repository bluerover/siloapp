/**
 * Widget
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
    template_filename: {
      type: 'string',
      required: true
    },
    js_filename: 'string',
    css_filename: 'string',
    dashboard_widgets: {
      collection: 'dashboard_widget',
      via: 'widget'
    }
    
  }

};
