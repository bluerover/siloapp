/**
 * HandheldData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

    external_id: {
      type: 'integer',
      required: true
    },
    device_id: {
      columnName: 'device_id',
      type: 'string',
      foreignKey: true,
      references: 'handheld',
      on: 'device_id',
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
