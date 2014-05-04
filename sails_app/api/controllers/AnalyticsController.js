/**
 * AnalyticsController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function (req, res) {
    res.view({
      title: "BlueRover Analytics",
      organization_name: req.session.organization_name,
      page_category: "analytics",
      full_name: req.session.full_name
    });
  }
};