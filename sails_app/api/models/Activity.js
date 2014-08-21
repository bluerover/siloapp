/**
 * Activity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    
    rest_call: {
      type: 'string',
      required: true
    },
    role: {
        model: 'role'
    },

  }

};
