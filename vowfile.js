'use strict'

module.exports = (cli, runner) => {
  runner.before(async () => {
    const Server = use('Server')
    Server.listen(process.env.HOST || '127.0.0.1', process.env.PORT || 3333)

    const ace = require('@adonisjs/ace')
    await ace.call('migration:run', {}, { silent: true })
  })

  runner.after(async () => {
    const Server = use('Server')
    Server.getInstance().close()
  })
}
