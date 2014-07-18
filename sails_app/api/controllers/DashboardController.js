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
  _config: {
    blueprints: {
      rest: true
    }
  },

  home: function (req, res) {
    Dashboard.find({organization: req.session.organization}).exec(function (err, dashboard_rows) {
      if (err) {
        sails.log.error("There was an error retrieving list of dashboards: " + err);
        return;
      }
      if(req.session.is_parent) {
        Organization.findOne(req.session.organization).exec(
        function (err,org) {
          if(err) {
            sails.log.error("Error retrieving organizations: " + err);
            return;
          }
        
          //make the current org the parent
          req.session.organization = org.parent ? org.parent : org.id;

          Dashboard.query("select d.id, o.name from dashboard as d " + 
          "join organization as o on d.organization = o.id " +
          "where o.parent = ?",
          [req.session.organization], function (err, dashboards) {
            if(err) {
              sails.log.error("Error retrieving child dashboards" + err)
              return;
            }
            res.view({
              title: "Dashboard Selection", 
              organization_name: req.session.organization_name,
              is_parent: req.session.is_parent,
              page_category: "dashboard",
              full_name: req.session.full_name,
              dashboards: dashboards
            });
          });
        });
      }
      else if(dashboard_rows.length === 1) {
        res.redirect('/dashboard/' + dashboard_rows[0].id);
      }
    });
  },

  show: function(req, res) {
    var ip = require("ip");
    var dashboard_id = req.param('id');

    sails.log.debug("Dashboard controller request");

    if (dashboard_id === undefined || dashboard_id === null) {
      res.view({layout: "barebones"}, '404');
      return;
    }

    sails.log.debug("Attempting to find dashboard from database for dashboard request");
    Dashboard.query("SELECT d.name, d.id, d.organization, o.name as organization_name from dashboard as d " +
                    "join organization as o on d.organization = o.id " +
                    "where d.id = ?",[dashboard_id], function (err, d) {
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

      //Reset organization, organization name in case you're a parent
      req.session.organization = dashboard.organization;
      req.session.organization_name = dashboard.organization_name;


      sails.log.debug("Attempting to find dashboard widget from database for dashboard request");
      Dashboard_Widget.find({dashboard: dashboard_id}).populate('widget').sort('widget_order ASC').exec(function (err, dashboard_widgets) {
        if (err) {
          res.view({layout: "barebones"}, '500');
          return;
        }

        sails.log.info("Got widgets");
        req.session.dashboard_id = dashboard_id;
        
        res.view({
          title: dashboard.name,
          is_parent: req.session.is_parent,
          dashboard_id: req.session.dashboard_id,
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
