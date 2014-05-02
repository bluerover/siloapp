/**
 * DashboardWidget_Widget
 *
 * @module      :: Model
 * @description :: This object is NOT meant to be used for persistent storage. The purpose of this
 * class is so that the dashboard queries have a model to bind to.
 * @docs    :: http://sailsjs.org/#!documentation/models
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
    options: {
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
    
  }

};
