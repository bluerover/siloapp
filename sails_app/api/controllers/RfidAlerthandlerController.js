/**
 * RfidAlerthandlerController.js 
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

  get_handlers: function (req, res) {
  	res.json(sails.notification_handlers);
  }
};
