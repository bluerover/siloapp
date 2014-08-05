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
      is_parent: req.session.is_parent,
      dashboard_id: req.session.dashboard_id,
      organization_name: req.session.organization_name,
      page_category: "Analytics",
      full_name: req.session.full_name
    });
  }
};
