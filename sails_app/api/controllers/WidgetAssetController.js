function jsonStatus(response, status_code, message) {
  response.json({error: message}, status_code);
}

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
    var path = require('path');
    var fs = require('fs');
    
    var type = req.param('type');
    var file = req.param('file');

    if ((type === undefined || type === null || file === undefined || file === null) ||
      (type !== "js" && type !== "styles" && type !== "images")) {
      jsonStatus(res, "File not found", 404);
      return;
    }

    // Stream file to client function
    var streamFile = function () {
      var file_path = path.join(sails.project_path, "widget_assets", type, file);

      if (!fs.existsSync(file_path)) {
        jsonStatus(res, "File not found", 404);
        return;
      }

      var file_stream = fs.createReadStream(file_path);
      file_stream.pipe(res);
    };

    // TODO: Check to see if user can access filetype
    // For now, allow them access to all files
    streamFile();
  }
  
};
