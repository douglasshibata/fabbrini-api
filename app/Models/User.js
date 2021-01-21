'use strict'

// /** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
// const Model = use('Model')
/** @type {typeof import('lucid-mongo/src/LucidMongo/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.morphMany('App/Models/Token','user_id','cpfUser')
  }
  agenda(){
    return this.morphMany('App/Models/Agenda')
  }
}

module.exports = User
