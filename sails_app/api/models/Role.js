/**
 * Role
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    activities: {
      collection: 'activity',
      via: 'role'
    },
    user: {
      model: 'user',
      required: true
    },
    desc: 'string',
  },

};
