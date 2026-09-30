'use strict'

const { test, trait } = use('Test/Suite')('Prontuario Controller')
const User = use('App/Models/User')
const Agenda = use('App/Models/Agenda')
const { cpf } = require('cpf-cnpj-validator')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('should allow doctor assigned to appointment to create prontuario', async ({ client }) => {
  const doctorCpf = cpf.generate()
  const patientCpf = cpf.generate()

  const doctor = await User.create({
    cpfUser: doctorCpf,
    nome: 'Dr Watson',
    email: 'watson@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  await User.create({
    cpfUser: patientCpf,
    nome: 'Sherlock Holmes',
    email: 'sherlock@example.com',
    password: 'StrongP@ss123',
    ehMedico: false
  })

  const agenda = await Agenda.create({
    doctor_cpf: doctorCpf,
    paciente_cpf: patientCpf,
    horario: '2026-10-10 14:00:00'
  })

  const response = await client
    .post(`/agenda/${agenda.id}/prontuario`)
    .loginVia(doctor, 'jwt')
    .send({
      prontuario: 'Paciente apresenta sintomas leves.'
    })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    agenda_id: agenda.id,
    prontuario: 'Paciente apresenta sintomas leves.'
  })
})

test('should prevent non-doctor from creating prontuario', async ({ client }) => {
  const doctorCpf = cpf.generate()
  const patientCpf = cpf.generate()

  await User.create({
    cpfUser: doctorCpf,
    nome: 'Dr Jekyll',
    email: 'jekyll@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  const patient = await User.create({
    cpfUser: patientCpf,
    nome: 'Mr Hyde',
    email: 'hyde@example.com',
    password: 'StrongP@ss123',
    ehMedico: false
  })

  const agenda = await Agenda.create({
    doctor_cpf: doctorCpf,
    paciente_cpf: patientCpf,
    horario: '2026-10-10 15:00:00'
  })

  const response = await client
    .post(`/agenda/${agenda.id}/prontuario`)
    .loginVia(patient, 'jwt')
    .send({
      prontuario: 'Tentativa do paciente criar prontuario'
    })
    .end()

  response.assertStatus(403)
})

test('should prevent doctor from creating prontuario for another doctors appointment', async ({ client }) => {
  const doctor1Cpf = cpf.generate()
  const doctor2Cpf = cpf.generate()
  const patientCpf = cpf.generate()

  await User.create({
    cpfUser: doctor1Cpf,
    nome: 'Dr One',
    email: 'one@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  const doctor2 = await User.create({
    cpfUser: doctor2Cpf,
    nome: 'Dr Two',
    email: 'two@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  const agenda = await Agenda.create({
    doctor_cpf: doctor1Cpf,
    paciente_cpf: patientCpf,
    horario: '2026-10-10 16:00:00'
  })

  const response = await client
    .post(`/agenda/${agenda.id}/prontuario`)
    .loginVia(doctor2, 'jwt')
    .send({
      prontuario: 'Prontuario de outro medico'
    })
    .end()

  response.assertStatus(403)
})
