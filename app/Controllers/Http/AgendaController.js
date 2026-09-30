'use strict'

const Agenda = use('App/Models/Agenda');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with agenda
 */
class AgendaController {
  /**
   * Show a list of all agenda for authenticated user.
   * GET agenda
   */
  async index ({ auth }) {
    const userCpf = auth.user.cpfUser
    const agenda = await Agenda
      .query()
      .where(function () {
        this.where('paciente_cpf', userCpf).orWhere('doctor_cpf', userCpf)
      })
      .orderBy('horario')
      .with('prontuario')
      .fetch()
    return agenda
  }

  /**
   * Create/save a new agenda.
   * POST agenda
   */
  async store ({ request, response, auth }) {
    const data = request.only(['doctor_cpf', 'paciente_cpf', 'horario'])

    if (auth.user.cpfUser !== data.doctor_cpf && auth.user.cpfUser !== data.paciente_cpf) {
      return response.status(403).send({ message: { error: 'Não autorizado a agendar para outro usuário' } })
    }

    const agenda = await Agenda.create(data)
    return response.status(201).json(agenda)
  }

  /**
   * Update agenda details.
   * PUT or PATCH agenda/:id
   */
  async update ({ params, request, response, auth }) {
    const atualizarAgenda = await Agenda.findOrFail(params.id)

    if (auth.user.cpfUser !== atualizarAgenda.doctor_cpf && auth.user.cpfUser !== atualizarAgenda.paciente_cpf) {
      return response.status(403).send({ message: { error: 'Não autorizado a alterar este agendamento' } })
    }

    const data = request.only(['doctor_cpf', 'paciente_cpf', 'horario'])
    atualizarAgenda.merge(data)
    await atualizarAgenda.save()

    return atualizarAgenda
  }

  /**
   * Delete an agenda with id.
   * DELETE agenda/:id
   */
  async destroy ({ params, response, auth }) {
    const agenda = await Agenda.findOrFail(params.id)

    if (auth.user.cpfUser !== agenda.doctor_cpf && auth.user.cpfUser !== agenda.paciente_cpf) {
      return response.status(403).send({ message: { error: 'Não autorizado a remover este agendamento' } })
    }

    await agenda.delete()
    return response.status(200).send({ message: 'Agendamento removido' })
  }
}

module.exports = AgendaController
