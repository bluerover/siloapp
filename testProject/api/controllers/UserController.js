/**
 * UserController
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
   * (specific to UserController)
   */
  _config: {},

  /**
   * POST /user/login
   * Logs in user
   */
  login: function (req, res) {
    var bcrypt = require('bcrypt');

    User.findOneByUsername(req.body.username).done(function (err, user) {
      if (err) res.json({error: "Internal Server Error"}, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.json({error: "Internal Server Error"}, 500);

          Organization.findOne(user.organization_id).done(function (err, org) {
            if (err || org === undefined || org === null) {
              res.json({error: "Internal Server Error"}, 500);
              return;
            }
            else {
              if (match) {
                req.session.user = user.id;
                req.session.username = user.username;
                req.session.username = user.username;
                req.session.full_name = user.full_name();
                req.session.organization = user.organization_id;
                req.session.organization_name = org.name;
                req.session.authenticated = true;
                res.json({
                  username: user.username,
                  email: user.email
                });
              }
              else {
                if (req.session.user) req.session.user = null;
                res.json({error: "Invalid password"}, 400);
              }
            }
          });
        })
      }
      else {
        res.json({error: "User not found"}, 404);
      }
    });
  },

  logout: function (req, res) {
    req.session = null;
    res.json({success: "Successfully logged out"});
  }
  
};
