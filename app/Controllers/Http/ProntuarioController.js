'use strict'

const Prontuario = use('App/Models/Prontuario');
const Agenda = use('App/Models/Agenda');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with prontuarios
 */
class ProntuarioController {
  /**
   * Show a list of all prontuarios.
   * GET prontuarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const prontuario = await Prontuario.all()
    return prontuario;
  }

  /**
   * Create/save a new prontuario.
   * POST prontuarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, params }) {
    const agenda = await Agenda.findOrFail(params.id);
    const texto = request.only(['prontuario', 'agenda_id']);
    const res = await agenda.prontuario().create(texto);
    return res;
  }

  /**
   * Display a single prontuario.
   * GET prontuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const agenda = await Agenda.findOrFail(params.id);
    await agenda.load('prontuario')
    return agenda
  }

  /**
   * Update prontuario details.
   * PUT or PATCH prontuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const agenda = await Agenda.findOrFail(params.id);
    const texto = request.only(['prontuario', 'agenda_id']);
    await agenda.merge(texto)
    await agenda.save()
    return agenda
  }

  /**
   * Delete a prontuario with id.
   * DELETE prontuarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ProntuarioController
