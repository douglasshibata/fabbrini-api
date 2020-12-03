'use strict'
//Esquema da tabela agenda
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AgendaSchema extends Schema {
  up() {
    this.create('agenda', (table) => {
      table.increments()
      table
        .string('doctor_cpf')
        .unsigned()
        .references('cpfUser')
        .inTable('users')
        .onUpdate('CASCADE')
      table
        .string('paciente_cpf')
        .unsigned()
        .references('cpfUser')
        .inTable('users')
        .onUpdate('CASCADE')
      table.datetime('horario', { useTz: true, precision: 6 })
      table.timestamps()
    })
  }

  down() {
    this.drop('agenda')
  }
}

module.exports = AgendaSchema
