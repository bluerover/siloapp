/**
 * Dashboard
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    id: {
      type: 'integer',
      required: true
    },
    device_id: {
      type: 'string',
      required: true
    },
    probe_id: {
      type: 'string',
      required: true
    },
    timestamp: {
      type: 'integer',
      required: true
    },
    item_id: {
      type: 'integer',
      required: true
    },
    user_id: {
      type: 'integer',
      required: true
    },
    temperature: {
      type: 'float',
      required: false
    },
    alarm: {
      type: 'integer',
      required: false
    },
    username: {
      type: 'string',
      required: false
    },
    item_name: {
      type: 'string',
      required: false
    }

  }

};
