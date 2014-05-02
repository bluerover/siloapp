module.exports = {
  _config: {
    expectIntegerId: true,
    blueprints: {
      actions: false,
      rest: false,
      shortcuts: false
    }
  }, 

  rfid: function (req, res) {
    res.view({
      title: "RFID Sensor Report",
      organization_name: req.session.organization_name,
      page_category: "reports",
      full_name: req.session.full_name,
      report_type: 'rfid'
    });
  },

  handheld: function (req, res) {
    res.view({
      title: "Handheld Temperature Sensor Report",
      organization_name: req.session.organization_name,
      page_category: "reports",
      full_name: req.session.full_name,
      report_type: 'handheld'
    });
  }
}