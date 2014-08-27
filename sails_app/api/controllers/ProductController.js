/**
 * ProductController
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
    
  _config: {
    blueprints: {
      rest: true,
      shortcuts: true
    }
  },

  home: function(req,res) {
    Product.find().exec(function (err, products) {
      if(err) {
        sails.log.error("Error when retrieving products: " + err);
        res.view({layout: "barebones"}, '500');
        return;
      }
      res.view({
        title: "Product Management",
        page_category: "productmgmt",
        full_name: req.session.full_name,
        current_farm: req.session.current_farm,
        current_silo: req.session.current_silo,
        products: products
      });
    });
  },

  get_product: function(req,res) {
    var productId = req.query["id"];
    var action = req.query["action"];
    if(action === "Add") {
      
      //make a dummy product, this should reflect the Product model
      var product = {name: "", SKU_ID: "", desc: "", id: ""};
      res.view('product/form', {product: product, action: action, layout:null});
      return;
    }
    Product.findOne(productId).exec(function (err, product) {
      if(err) {
        sails.log.error("Error when retrieving product: " + err);
        res.json(err,500);
        return;
      }
      res.view('product/form', {product: product, action: action, layout:null});
    });
  },

  delete_product: function(req,res) {
    var productId = req.param("id");
    Silo.find(productId).exec(function (err, silos) {
      if(err) {
        sails.log.error("Error when retrieving silos: " + err);
        res.json(err,500);
        return;
      }
      if(silos.length === 0) {
        Product.destroy({id:productId}).exec(function (err, deletedProduct) {
          if(err) {
            sails.log.error("Error when deleting product: " + err);
            res.json(err,500);
            return;
          }
          if(deletedProduct) {
            sails.log.info("deleted product " + deletedProduct[0].name);
          }
          res.json("");
        })
      } else {
        usingSiloString = "";
        for(var index in silos) {
          usingSiloString += silos[index].name + ",";
        }
        res.json(usingSiloString.slice(0,-1),406);
      }
    });
  }

  
};

