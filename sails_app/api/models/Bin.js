/**
 * Bin
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
        type: 'string',
        required: true
    },
    desc: {
        type: 'string',
        defaultsTo: "No description"
    },
    farm: {
        model: 'farm'
    },
    product: {
        model: 'product'
    },
    changelog: {
        collection: 'binchangelog',
        via: 'bin'
    },
    capacity: 'integer',
    location: 'string',
    rfid: 'integer',
    level_1: 'integer',
    level_2: 'integer',
    level_3: 'integer',
    level_4: 'integer'
  },

  get_changelog: function (opts, cb) {
    var queryString = " \
        select \
          rfidTagNum as rfid \
        , level \
        , (CASE WHEN rfidTagNum <> previous_rfid \
            THEN NULL \
            ELSE previous_level \
            END) AS previous_level \
        , timestamp \
          \
        from ( \
          select  \
            y.* \
          , @prev_r AS previous_rfid \
          , @prev_r := rfidTagNum \
          , @prev AS previous_level \
          , @prev := level \
          from  \
            bindata y \
          , (select @prev:=NULL, @prev_r:=NULL) vars \
          order by rfidTagNum, timestamp \
        ) with_previous " +

        "WHERE ( \
           level <> previous_level \
        OR previous_level IS NULL \
        OR previous_rfid <> rfidTagNum \
        OR previous_rfid IS NULL \
        ) " +
        (opts.rfids? "AND rfidTagNum IN (" + opts.rfids.join(',') + ") " : " " ) + 
        (opts.period? 
          "AND timestamp  \
          BETWEEN" + opts.period.from +
             "AND" + opts.period.to + " "
          : " " 
        ) +
        "ORDER BY rfid, timestamp DESC "

    Bin.query(queryString, cb);
  }
};
