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

var DEFAULT_ROUTE = "dashboards";

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {
    blueprints: {
      rest: true
    }
  },

  login_view: function (req, res) {
    if (req.session && req.session.authenticated) {
      // Redirect to dashboard
      res.redirect(DEFAULT_ROUTE);
    }

    sails.log.debug(require('util').inspect(req.query));

    res.view({ layout: 'none', redirect_to: req.query.redirect_to }, 'user/login');
  },

  /**
   * POST /user/login
   * Logs in user
   */
  login: function (req, res) {
    sails.log.info("User login request");
    var bcrypt = require('bcrypt');

    User.findOneByUsername(req.body.username).done(function (err, user) {
      if (err) res.view({layout: "barebones"}, '500');

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.view({layout: "barebones"}, '500');
          if (match) {
            Organization.findOne(user.organization).done(function (err, org) {
              if (err || org === undefined || org === null) {
                res.view({layout: "barebones"}, '500');
                return;
              }
              
              req.session.user = user.id;
              req.session.username = user.username;
              req.session.full_name = user.full_name();
              req.session.is_admin = user.is_admin;
              req.session.organization = user.organization;
              req.session.organization_name = org.name;
              req.session.authenticated = true;
              if (req.body.redirect_to !== undefined && req.body.redirect_to !== null) {
                res.redirect(req.body.redirect_to);
              }
              else {
                res.redirect(DEFAULT_ROUTE);
              }
            });
          }
          else {
            if (req.session.user) req.session.user = null;
            res.view({
              layout: "none",
              error: "Incorrect username and/or password"
            }, 'user/login');
          }
        })
      }
      else {
        res.view({
          layout: "none",
          error: "Incorrect username and/or password"
        }, 'user/login');
      }
    });
  },

  logout: function (req, res) {
    req.session.user = null;
    req.session.username = null;
    req.session.full_name = null;
    req.session.organization = null;
    req.session.organization_name = null;
    req.session.authenticated = false;
    res.redirect('/');
  }
  
};
