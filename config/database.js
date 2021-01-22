'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');
const Url = require('url-parse');
const DATABASE_URL = new Url(Env.get('DATABASE_URL'));
const MONGO_URL = Env.get('MONGO_URL');
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
  connection: Env.get('DB_CONNECTION_STRING', 'mongodb'),

  mongodb: {
    client: 'mongodb',
    options:{useNewUrlParser:true,useUnifiedTopology:true},
    connectionString: Env.get('DB_CONNECTION_STRING',MONGO_URL),
    connection: {
      host: Env.get('DB_HOST', DATABASE_URL.hostname),
      port: Env.get('DB_PORT', DATABASE_URL.port),
      username: Env.get('DB_USER', DATABASE_URL.username),
      password: Env.get('DB_PASSWORD', DATABASE_URL.password),
      database: Env.get('DB_DATABASE',  DATABASE_URL.pathname.substr(1)),
      options: {
        useUnifiedTopology: true,
        useNewUrlParser:true
        // replicaSet: Env.get('DB_REPLICA_SET', '')
        // ssl: Env.get('DB_SSL, '')
        // connectTimeoutMS: Env.get('DB_CONNECT_TIMEOUT_MS', 15000),
        // socketTimeoutMS: Env.get('DB_SOCKET_TIMEOUT_MS', 180000),
        // w: Env.get('DB_W, 0),
        // readPreference: Env.get('DB_READ_PREFERENCE', 'secondary'),
        // authSource: Env.get('DB_AUTH_SOURCE', ''),
        // authMechanism: Env.get('DB_AUTH_MECHANISM', ''),
        // other options
      }
    }
  }
  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  // pg: {
  //   client: 'pg',
  //   connection: {
  //     host: Env.get('DB_HOST', DATABASE_URL.hostname),
  //     port: Env.get('DB_PORT', DATABASE_URL.port),
  //     user: Env.get('DB_USER', DATABASE_URL.username),
  //     password: Env.get('DB_PASSWORD', DATABASE_URL.password),
  //     database: Env.get('DB_DATABASE', DATABASE_URL.pathname.substr(1))
  //   },
  //   debug: Env.get('DB_DEBUG', false)
  // },
  

}
