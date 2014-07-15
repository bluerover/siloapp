/**
 * OrganizationController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  _config: {
    blueprints: {
      rest: true
    }
  },

  get_children: function (req, res) {
    Dashboard.query("select d.id, o.name, o.location from dashboard as d " + 
    "join organization as o on d.organization = o.id " +
    "where o.parent = ?",
    [req.session.organization], function (err, orgs) {
      if(err) {
        sails.log.error("Error with getting child orgs: " + err);
        res.json(JSON.stringify(err),500);
      } else {
        res.json(JSON.stringify(orgs));
      }
    });
  }
};
