'use strict'
//Esquema da tabela prontuário
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProntuarioSchema extends Schema {
  up () {
    this.create('prontuarios', (table) => {
      table.increments()
      table
      .integer('agenda_id')
      .references('id')
      .inTable('agenda')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      table.string('prontuario').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('prontuarios')
  }
}

module.exports = ProntuarioSchema
