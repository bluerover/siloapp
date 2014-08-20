module.exports = {
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  compliance: function (req, res) {
    res.view({
      title: "Compliance Report",
      dashboard_id: req.session.dashboard_id,
      organization_num: req.session.organization_num,
      organization_name: req.session.organization_name,
      page_category: "reports",
      full_name: req.session.full_name,
      report_type: 'compliance'
    });
  },

  rfid: function (req, res) {
    res.view({
      title: "RFID Sensor Report",
      is_parent: req.session.is_parent,
      dashboard_id: req.session.dashboard_id,
      organization_name: req.session.organization_name,
      page_category: "reports",
      full_name: req.session.full_name,
      report_type: 'rfid'
    });
  },

  handheld: function (req, res) {
    res.view({
      title: "Handheld Temperature Sensor Report",
      is_parent: req.session.is_parent,
      dashboard_id: req.session.dashboard_id,
      organization_name: req.session.organization_name,
      page_category: "reports",
      full_name: req.session.full_name,
      report_type: 'handheld'
    });
  }
}