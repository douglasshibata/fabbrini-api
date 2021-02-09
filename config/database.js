'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');
const Url = require('url-parse');
// const DATABASE_URL = new Url(Env.get('DATABASE_URL'));
const DATABASE_URL = new Url(Env.get('MONGO_URL'));
const MONGO_URL =Env.get('MONGO_URL');
module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'pg'),

   pg: {
     client: 'pg',
     connection: {
       host: Env.get('DB_HOST', DATABASE_URL.hostname),
       port: Env.get('DB_PORT', DATABASE_URL.port),
       user: Env.get('DB_USER', DATABASE_URL.username),
       password: Env.get('DB_PASSWORD', DATABASE_URL.password),
       database: Env.get('DB_DATABASE', DATABASE_URL.pathname.substr(1))
     },
     debug: Env.get('DB_DEBUG', false)
   },

}
