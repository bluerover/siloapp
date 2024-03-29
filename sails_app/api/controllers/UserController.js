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

var DEFAULT_ROUTE = "dashboard";

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

    res.view('user/login', { layout: 'none', redirect_to: req.query.redirect_to });
  },

  /**
   * POST /user/login
   * Logs in user
   */
  login: function (req, res) {
    sails.log.info("User login request");
    var bcrypt = require('bcrypt');

    User.findOneByUsername(req.body.username).exec(function (err, user) {
      if (err) res.view({layout: "barebones"}, '500');

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.view({layout: "barebones"}, '500');
          if (match) {
            req.session.user = user.id;
            req.session.username = user.username;
            req.session.full_name = user.full_name();
            req.session.organization = user.organization;
            req.session.authenticated = true;
            if (req.body.redirect_to !== undefined && req.body.redirect_to !== null) {
              res.redirect(req.body.redirect_to);
            }
            else {
              res.redirect(DEFAULT_ROUTE);
            }
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
    req.session.current_bin = undefined;
    req.session.current_farm = undefined;
    req.session.authenticated = false;
    res.redirect('/');
  },

  settings: function (req, res) {
    User.findOne(req.session.user).exec(function (err,user) {
      if(err) {
        sails.log.error("Cannot find user settings for user " + req.session.user + ": " + err);
        return;
      }
      res.view('user/settings',{
        title: "User Settings",
        page_category: "settings",
        user: user,
        full_name: req.session.full_name,
        current_farm: req.session.current_farm,
        current_bin: req.session.current_bin
      });
    });
  },

  save_settings: function (req, res) {
    sails.log.info("User change request");
    var bcrypt = require('bcrypt');

    User.findOne(req.session.user).exec(function (err,user) {
      if(err) {
        sails.log.error("Cannot find user settings for user " + req.session.user + ": " + err);
        return;
      }
      bcrypt.compare(req.query["old_password"], user.password, function (err, match) {
          if (err) {
            sails.log.error(err);
            res.view({layout: "barebones"}, '500');
            return;
          } 
          if (match) {
            req.query["is_alert_active"] = req.query["is_alert_active"] === "on" ? 1 : 0;
            User.update({id: req.session.user},req.query).exec(function (err,updatedUsers) {
              if(err || updatedUsers.length === 0) {
                sails.log.error(err);
                res.json("Error with update: " + err, 500);
                return;
              }
              if(updatedUsers.length > 0 && updatedUsers[0].id === req.session.user) {
                req.session.full_name = updatedUsers[0].full_name();
                res.json("User updated successfully");  
              }
            });
          } else {
            res.json("Invalid old password, please verify and try again", 401);
            return; 
          }
      });
    });
  },

  get_active_emails: function (req,res) {
    User.findOne(req.session.user).exec(function (err,user) {
      if(err || !user.is_admin) {
        res.view({layout: "barebones"}, '500');
        return;
      }
      User.find({where: {is_alert_active: true}}).exec(function (err, users) {
        if(err) {
          res.json(err);
        } else {
          res.json(users);
        }
      });
    });
  }
  
};
