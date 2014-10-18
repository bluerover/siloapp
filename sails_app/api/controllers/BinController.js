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

moment = require("moment");
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
    if (req.query.product == null) req.query.product = "";
    Product.find({name: {like: '%' + req.query.product + '%'}})
    .where({organization: req.session.organization})
    .exec(function (err, products) {
      if(err) {
        sails.log.error("Error with retrieving like products: " + err);
        res.json(err,500);
        return;
      } else if (products.length === 0) {
        res.json("No bins match your criteria, please try again",400);
        return;
      }

      productIds = _.pluck(products, 'id');

      var filterByNameAndProduct = {}
      if (req.query.binName) {name: {like: '%' + req.query.binName + '%'}};
      if (productIds.length > 0 ) filterByNameAndProduct.product = productIds;

      //find bins with given names and products
      Bin.find(filterByNameAndProduct)
      .populateAll()
      .exec(function (err, bins) {
        if (err) {
          sails.log.error("Error when getting bins: " + err);
          return res.json(err,500);
        }

        //filter by reigon in js since we can get it using populate all
        if (req.query.region)
          bins = _.filter(bins, function (thisBin) {return (thisBin.farm.region == req.query.region)});
        if (bins.length < 1) {
          return res.json('No Bins Found', 404);
        }

        //did the request ask for spesific rfids?
        var opts = {};
        var rfids = _.pluck(bins, 'rfid')
        if (rfids.length > 0) opts.rfids = rfids;

        if (req.query.from && req.query.to) { //we have a time period
          opts.period = {};
          opts.period.from = req.query.from;
          opts.period.to = req.query.to;
        } else if (req.param.from) { //since some date
          opts.period = {};
          opts.period.from = req.param.from;
          opts.period.to = parseInt(new Date().getTime() / 1000);
        } else if (req.param.to) { // till some date
          opts.period = {};
          opts.period.from = 0;
          opts.period.to = req.query.to;
        }

        //custom query that returns every changing edge
        Bin.get_changelog(opts, function (err, binLog) {
          if(err) {
            sails.log.error("Error when getting recent bin data: " + err);
            return res.json(err,500);
          }

          //if we want just the latest for each rfid, max timestamp should be this one
          if (req.query.latest) {
            binLog = _.filter(binLog, function (thisRow, index, allRows) {
               return _.chain(allRows)
                       .where({rfid: thisRow.rfid})
                       .pluck('timestamp')
                       .max()
                       .value() == thisRow.timestamp
             })
          }

          binLog = _.map(binLog, function (thisRow, index, allRows) {

            var thisBin = _.findWhere(bins, {rfid: parseInt(thisRow.rfid)});
            if (thisBin == null) return null;

            var result = {};
            result.id = thisBin.id;
            result.name = thisBin.name;
            result.location = thisBin.location;
            result.farm = thisBin.farm.name;
            result.farmid = thisBin.farm.id;
            result.product = thisBin.product.name;
            result.productId = thisBin.product.id;
            result.since = thisRow.since;
            result.since = thisRow.timestamp;
            result.level = thisRow.level;
            result.levels = {
              level_1: thisBin.level_1,
              level_2: thisBin.level_2,
              level_3: thisBin.level_3,
              level_4: thisBin.level_4
            }

            //What is the most recent event after this one?
            after_result = _.chain(allRows)
              .filter(function (thisResult, index, allResults) {
                return thisResult.rfid === thisRow.rfid 
                    && thisResult.timestamp > thisRow.timestamp
              }).pluck('timestamp')
              .min()
              .value()
 
            //if there is none then lets just make it 
            if (after_result == null || after_result == Infinity) 
              after_result =  parseInt(new Date().getTime() / 1000);

            result.duration = after_result - thisRow.timestamp;
          
            return result;

          });
  
          if (req.query.latest) {
            //sort based on the duration and level for knowing most important
            binLog = _.chain(binLog).compact().sortBy('duration').reverse().sortBy('level').value();
            return res.view('dashboard/bintable', {binData: binLog, moment: moment, layout:null});
          } else {
            //sort based on timestamp to get a changelog style thing going
            binLog = _.chain(binLog).compact().sortBy('since').reverse().value();
            return res.json(binLog, 200)
          }
          
        })

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