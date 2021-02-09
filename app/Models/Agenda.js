'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Agenda extends Model {
   user(){
       return this.embedsMany('App/Models/User');
   }
   prontuario(){
       return this.morphOne('App/Models/Prontuario')
   }

}

module.exports = Agenda
