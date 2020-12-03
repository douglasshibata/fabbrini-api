'use strict'

//Esquema da Tabela Usuários
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('cpfUser', 11).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('nome', 100).notNullable()
      table.string('password', 60).notNullable()
      table.string('telefone', 20)
      table.string('conselho', 100)
      table.string('ufConselho', 2)
      table.string('registro', 254)
      table.string('especialidade', 250)
      table.boolean('ativo').defaultTo(true)//No futuro para mudar false
      table.boolean('ehMedico').defaultTo(false)
      table.boolean('ehPaciente').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
