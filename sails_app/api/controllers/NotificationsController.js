/**
 * NotificationsController
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

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NotificationsController)
   */
module.exports = {
  index: function (req, res) {
    res.view({
      title: "BlueRover Notifications",
      organization_num: req.session.organization_num,
      organization_name: req.session.organization_name,
      page_category: "notifications",
      full_name: req.session.full_name
    });
  }
};
