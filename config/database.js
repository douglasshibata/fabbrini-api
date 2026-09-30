'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')
const Url = require('url-parse')

const rawDbUrl = Env.get('DATABASE_URL', 'postgres://root:@127.0.0.1:5432/fabbrini')
const DATABASE_URL = new Url(rawDbUrl)

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
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('NODE_ENV', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', DATABASE_URL.hostname || '127.0.0.1'),
      port: Env.get('DB_PORT', DATABASE_URL.port || 5432),
      user: Env.get('DB_USER', DATABASE_URL.username || 'postgres'),
      password: Env.get('DB_PASSWORD', DATABASE_URL.password || ''),
      database: Env.get('DB_DATABASE', (DATABASE_URL.pathname && DATABASE_URL.pathname.substr(1)) || 'fabbrini')
    },
    debug: Env.get('DB_DEBUG', false)
  }
}
