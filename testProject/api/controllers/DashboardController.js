/**
 * DashboardController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DashboardController)
   */
  _config: {},

  // index: function (req, res) {
  //   res.json({success: "This will eventually show a list of dashboards"});
  // },

  find: function(req, res) {
    var ip = require("ip");
    var dashboard_id = req.param('id');

    sails.log.debug("Dashboard controller request");

    if (dashboard_id === undefined || dashboard_id === null) {
      res.view({layout: "barebones"}, '404');
      return;
    }

    sails.log.debug("Attempting to find dashboard from database for dashboard request");
    Dashboard.find({id: dashboard_id}).done(function (err, d) {
      if (err) {
        res.view({layout: "barebones"}, '500');
        return;
      }

      sails.log.debug("Found dashboard");

      if (d === undefined || d === null || d.length === 0) {
        res.view({layout: "barebones"}, '404');
        return;
      }

      var dashboard = d[0];

      if (req.session.organization !== dashboard.organization) {
        // Return 404 instead of 403 so that users cannot know if a dashboard exists or not
        res.view({layout: "barebones"}, '404');
        return;
      }

      sails.log.debug("Attempting to find dashboard widget from database for dashboard request");
      Dashboard_Widget.find({dashboard: dashboard_id}).populate('widget').sort('widget_order ASC').exec(function (err, dashboard_widgets) {
        if (err) {
          res.view({layout: "barebones"}, '500');
          return;
        }

        sails.log.info("Got widgets");

        res.view({
          title: dashboard.name,
          organization_name: req.session.organization_name,
          page_category: "dashboard",
          full_name: req.session.full_name,
          dashboard_widgets: dashboard_widgets,
          load_dashboard_js: true,
          header_javascript: "",
          renderWidget: sails.custom_helpers.render_widget,
          host: ip.address(),
          port: process.env.PORT || 1337
        });
      });
    });
  }

  
};
