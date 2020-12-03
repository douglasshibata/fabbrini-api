'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Agenda extends Model {
   user(){
       return this.belongsToMany('App/Models/User');
   }
   prontuario(){
       return this.hasOne('App/Models/Prontuario')
   }

}

module.exports = Agenda
