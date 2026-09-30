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
   */
  async index ({ response, auth }) {
    if (!auth.user.ehMedico) {
      return response.status(403).send({ message: { error: 'Apenas médicos podem listar prontuários' } })
    }
    const prontuario = await Prontuario.all()
    return prontuario
  }

  /**
   * Create/save a new prontuario.
   * POST agenda/:id/prontuario
   */
  async store ({ request, response, params, auth }) {
    if (!auth.user.ehMedico) {
      return response.status(403).send({ message: { error: 'Apenas médicos podem criar prontuários' } })
    }

    const agenda = await Agenda.findOrFail(params.id)

    if (agenda.doctor_cpf !== auth.user.cpfUser) {
      return response.status(403).send({ message: { error: 'Você não é o médico desta consulta' } })
    }

    const texto = request.only(['prontuario'])
    const res = await agenda.prontuario().create({
      prontuario: texto.prontuario,
      agenda_id: agenda.id
    })

    return response.status(201).json(res)
  }

  /**
   * Display a single prontuario.
   * GET prontuarios/:id
   */
  async show ({ params, response, auth }) {
    const agenda = await Agenda.findOrFail(params.id)

    if (auth.user.cpfUser !== agenda.doctor_cpf && auth.user.cpfUser !== agenda.paciente_cpf) {
      return response.status(403).send({ message: { error: 'Não autorizado a visualizar este prontuário' } })
    }

    await agenda.load('prontuario')
    return agenda
  }

  /**
   * Update prontuario details.
   * PUT or PATCH prontuarios/:id
   */
  async update ({ params, request, response, auth }) {
    if (!auth.user.ehMedico) {
      return response.status(403).send({ message: { error: 'Apenas médicos podem editar prontuários' } })
    }

    const agenda = await Agenda.findOrFail(params.id)

    if (agenda.doctor_cpf !== auth.user.cpfUser) {
      return response.status(403).send({ message: { error: 'Você não é o médico desta consulta' } })
    }

    const prontuario = await Prontuario.findByOrFail('agenda_id', agenda.id)
    const texto = request.only(['prontuario'])

    prontuario.merge(texto)
    await prontuario.save()

    return prontuario
  }

  /**
   * Delete a prontuario with id.
   * DELETE prontuarios/:id
   */
  async destroy ({ params, response, auth }) {
    if (!auth.user.ehMedico) {
      return response.status(403).send({ message: { error: 'Apenas médicos podem deletar prontuários' } })
    }

    const agenda = await Agenda.findOrFail(params.id)

    if (agenda.doctor_cpf !== auth.user.cpfUser) {
      return response.status(403).send({ message: { error: 'Você não é o médico desta consulta' } })
    }

    const prontuario = await Prontuario.findByOrFail('agenda_id', agenda.id)
    await prontuario.delete()

    return response.status(200).send({ message: 'Prontuário removido' })
  }
}

module.exports = ProntuarioController
