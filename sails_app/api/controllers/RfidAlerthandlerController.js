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
  clear_handler: function (req,res) {
  	var tag_id = 'rfid-' + req.query.rfid;
  	sails.notification_handlers[tag_id] = [];
  	res.json({"message" : "removed " + tag_id, "handler" : sails.notification_handlers[tag_id]});
  }
};
