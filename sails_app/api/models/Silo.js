/**
 * Silo
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
        collection: 'silochangelog',
        via: 'silo'
    },
    silodata: {
        collection: 'silodata',
        via: 'silo'
    },
    capacity: 'integer',
    location: 'string',
    rfids: 'string'
  }

};
