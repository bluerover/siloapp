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
    var dashboard_id = req.param('id');

    if (dashboard_id === undefined || dashboard_id === null) {
      res.view({layout: "barebones"}, 404);
      return;
    }

    Dashboard.findOne(dashboard_id).done(function (err, dashboard) {
      if (err) {
        res.view({layout: "barebones"}, '500');
        return;
      }

      if (dashboard === undefined || dashboard === null) {
        res.view({layout: "barebones"}, '404');
        return;
      }

      if (req.session.organization !== dashboard.organization_id) {
        // Return 404 instead of 403 so that users cannot know if a dashboard exists or not
        res.view({layout: "barebones"}, '404');
        return;
      }

      Dashboard_Widget.find({ dashboard_id: dashboard_id }).done(function (err, dashboard_widgets) {
        if (err) {
          res.view({layout: "barebones"}, '500');
          return;
        }

        res.view({
          title: dashboard.name,
          organization_name: req.session.organization_name,
          page_category: "dashboard",
          full_name: req.session.full_name,
          dashboard_widgets: dashboard_widgets
        });
      });
    });
  }

  
};
