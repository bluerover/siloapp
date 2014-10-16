/**
 * BinController
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
      rest: true
    }
  },

  index: function(req,res) {
    var id = req.param('id');
    Bin.findOne(id).populate("product").exec(function (err, bin) {
      if (err) {
        sails.log.error("Error when retrieving bin " + err);
        return res.view('500', {layout: "barebones"});
      } 

      if (bin == null || bin.id == null) {
        sails.log.error("Error when retrieving bin " + id);
        return res.view('404', {layout: "barebones"});
      }

      req.session.current_bin = bin.id;
      req.session.current_farm = bin.farm;
      Farm.findOne({id: bin.farm}).populate("region").exec(function (err, farm) {
        if (err) {
          sails.log.error("Error when retrieving farm " + err);
          res.view('500', {layout: "barebones"});
          return;
        } 
        BinData.find({rfidTagNum: bin.rfid}).sort("timestamp desc").limit(10).exec(function (err, bindata) {
          // console.log(bindata);
          //we don't really care if you don't past data
          BinChangelog.find({bin: bin.id}).populate("new_product").populate("old_product").sort("timestamp desc").limit(5).exec(function (err, binChanges) {
            //we don't really care if you don't have any changes
            // console.log(binChanges);
            res.view({
              title: "Bin: " + bin.name, 
              page_category: "bin",
              full_name: req.session.full_name,
              current_farm: req.session.current_farm,
              current_bin: req.session.current_bin,
              bin: bin,
              farm: farm,
              bindata: bindata,
              binChanges: binChanges
            });
          });
        });
      });
    });
  },

  binsearch: function(req,res) {
    Product.find({ like: { name: '%'+req.query.product+'%' } }).where({organization: req.session.organization}).exec(function (err, products) {
      if(err) {
        sails.log.error("Error with retrieving like products: " + err);
        res.json(err,500);
        return;
      } else if (products.length === 0) {
        res.json("No bins match your criteria, please try again",400);
        return;
      }
      var productString = "";
      for(var index in products) {
        productString += products[index].id + ",";
      }
      //Get all the bins in the region with such product
      Bin.query("SELECT bin.rfid, bin.name, bin.location, bin.id FROM bin JOIN farm on farm.id = bin.farm " + 
             "WHERE bin.product IN (" + productString.slice(0,-1) + ") AND farm.region LIKE ? " +
             "AND bin.name LIKE ?",
             [req.query.region, '%' + req.query.binName + '%'],
      function (err,bins) {
        if(err) {
          sails.log.error("Error when getting subset of bins: " + err);
          res.json(err,500);
          return;
        } else if (bins.length === 0) {
          res.json("No bins match your criteria, please try again",400);
          return;
        }
        var binString = "";
        for(var index in bins) {
          binString += bins[index].rfid + ",";
        }
        //Now to get all the bindata for those bins
        BinData.query("SELECT L.rfidTagNum, L.level, DATE_FORMAT(FROM_UNIXTIME(L.timestamp), '%b %e %Y, %T') as recent FROM bindata L " +
               "LEFT JOIN bindata R ON " +
               "L.rfidTagNum = R.rfidTagNum AND " +
               "L.timestamp < R.timestamp " +
               "WHERE isnull(R.rfidTagNum) AND L.rfidTagNum IN (" + binString.slice(0,-1) + ") ORDER BY level ASC LIMIT 5",[],
        function (err, binData) {
          if(err) {
            sails.log.error("Error when getting recent bin data: " + err);
              res.json(err,500);
              return;
            }
            var tableData = [];
            for(var index in binData) {
              for(var index2 in bins) {
                if(bins[index2].rfid === parseInt(binData[index].rfidTagNum,10)) {
                  binData[index].name = bins[index2].name;
                  binData[index].location = bins[index2].location;
                  binData[index].id = bins[index2].id
                  tableData.push(binData[index]);
                }
              }
            }
            //i want this to go to a partial view
            res.view('dashboard/bintable', {binData: tableData, layout:null});
        });
      });
    });
  	
  },

  edit: function(req,res) {
    var binId = req.param('id');
    Bin.findOne(binId).populate('farm').populate('product').exec(function (err, bin) {
      if(err) {
        sails.log.error("Error when getting bin: " + err);
        res.view({layout: "barebones"}, '500');
        return;
      }
      Product.find({organization: req.session.organization}).exec(function (err, products) {
        if (err) {
          sails.log.error("Error getting products: " + err);
          res.view({layout: "barebones"}, '500');
          return;
        }

        res.view({
            title: "Bin Edit: " + bin.name, 
            page_category: "bin",
            full_name: req.session.full_name,
            current_farm: req.session.current_farm,
            current_bin: req.session.current_bin,
            bin: bin,
            products: products
          });
      });
    });
  },

  update: function(req,res) {
    delete req.query["farmName"];
    //verify that the product is in the product database
    Product.findOne({name: req.query.product}).where({organization: req.session.organization}).exec(function (err, product) {
      if(err || !product || product === undefined) {
        sails.log.error("Error finding product: " + err);
        res.json("Product name incorrect, please review and try again",500);
        return;
      }
      req.query.product = product.id;
      var changeLogFlag = false;
      if(product.id !== req.query.old_product_id) {
        changeLogFlag = true;
      }
      Bin.update(req.query.id,req.query).exec(function (err, updatedBin) {
        if(err) {
          sails.log.error("Error updating bin: " + err);
          res.json("Error updating bin " + err,500);
          return;
        } else {
          sails.log.info("Updated bin " + updatedBin[0].id);
          if(changeLogFlag) {
            var moment = require("moment");
            BinChangelog.create(
              {bin: updatedBin[0].id,
               old_product: req.query.old_product_id,
               new_product: req.query.product,
               timestamp: moment().unix()}
              ).exec(function (err, newLog) {
                if(err) { sails.log.error("Error creating change log " + err);
              }
            });
          }
          res.json("");
        }
      });
    });
  },

};