/**
 * DashboardController
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
   * (specific to DashboardController)
   */
  _config: {
    blueprints: {
      rest: true
    }
  },

  home: function (req, res) {
    //we need a list of regions, a list of products for the accordion
    Region.find().exec(function (err, regions) {
      if (err || regions === undefined || regions === null) {
        sails.log.error("No regions available: " + err);
        res.view({layout: "barebones"}, '500');
        return;
      }
      Product.find({organization: req.session.organization}).exec(function (err, products) {
        if (err || products === undefined || products === null) {
          sails.log.error("No products available: " + err);
          res.view({layout: "barebones"}, '500');
          return;
        }
        
        //now to actually generate the dashboard, we need user's farms
        //populateAll loads the associations for the collection
        Farm.find({organization: req.session.organization}).populateAll().exec(function (err, farms) {
          if (err || farms === undefined || farms === null) {
            res.view({layout: "barebones"}, '500');
            return;
          }
          res.view({
            title: "Safe Farm Dashboard", 
            page_category: "dashboard",
            full_name: req.session.full_name,
            current_farm: req.session.current_farm,
            current_bin: req.session.current_bin,
            user_farms: farms,
            regions: regions,
            products: products
          });
        });
      });
    });
  }

  
};
