/**
 * BinChangelog
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    bin: {
        model: 'bin'
    },
    old_product: {
        model: 'product'
    },
    new_product: {
        model: 'product'
    },
    timestamp: 'integer',
  }

};
