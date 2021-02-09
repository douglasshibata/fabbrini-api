'use strict'

/** @type {typeof import('lucid-mongo/src/LucidMongo/Model')} */
const Model = use('Model')

class Prontuario extends Model {
    agenda(){
        return this.belongsTo('App/Models/Agenda')
    }
}

module.exports = Prontuario
