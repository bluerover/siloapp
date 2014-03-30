module.exports = {

    _config: {
      expectIntegerId: false,
      blueprints: {
        actions: false,
        rest: false,
        shortcuts: false
      }
    },
    
    retrieveAsset: function(req, res) {
      // TODO: Validate user can access asset here
      res.json({type: req.param('type'), filename: req.param('file')});
    }
  
};
