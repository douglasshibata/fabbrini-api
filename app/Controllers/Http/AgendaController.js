'use strict'

const Agenda = use('App/Models/Agenda');
//const Database = use("Database");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with agenda
 */
class AgendaController {
  /**
   * Show a list of all agenda.
   * GET agenda
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const agenda = await Agenda.all()
    //      .query().where(function(){this
    //   .where('paciente_cpf',request.header('cpfPaciente'))
    //   .orWhere('doctor_cpf',request.header('cpfDoctor'))
    // }).orderBy('horario').with('prontuario').fetch() 
    return agenda
  }

  /**
   * Create/save a new agenda.
   * POST agenda
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(['doctor_cpf', 'paciente_cpf', 'horario']);
    const paciente = await Agenda.create(data);
    return paciente;
  }

  /**
   * Update agenda details.
   * PUT or PATCH agenda/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request}) {
    const atualizarAgenda = await Agenda.findOrFail(params.id)
    
    const data = request.only([
      'doctor_cpf', 'paciente_cpf', 'horario',
    ])

    atualizarAgenda.merge(data)

    await atualizarAgenda.save()

    return atualizarAgenda
  }

  /**
   * Delete a agenda with id.
   * DELETE agenda/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = AgendaController
