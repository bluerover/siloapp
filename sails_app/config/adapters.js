/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

var mysql_password = process.env.NODE_ENV === 'production' ? 'root' : 'root';

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'mysql',

  mysql: {
    module   : 'sails-mysql',
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : mysql_password,
    database : 'binapp'
  }
};
