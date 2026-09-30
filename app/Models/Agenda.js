'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Agenda extends Model {
  static get table () {
    return 'agenda'
  }

  doctor () {
    return this.belongsTo('App/Models/User', 'doctor_cpf', 'cpfUser')
  }

  paciente () {
    return this.belongsTo('App/Models/User', 'paciente_cpf', 'cpfUser')
  }

  prontuario () {
    return this.hasOne('App/Models/Prontuario', 'agenda_id', 'id')
  }
}

module.exports = Agenda
