'use strict'

const { test, trait } = use('Test/Suite')('Agenda Controller')
const User = use('App/Models/User')
const Agenda = use('App/Models/Agenda')
const { cpf } = require('cpf-cnpj-validator')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('should create agenda appointment when user is doctor or patient', async ({ client }) => {
  const doctorCpf = cpf.generate()
  const patientCpf = cpf.generate()

  const doctor = await User.create({
    cpfUser: doctorCpf,
    nome: 'Dr House',
    email: 'house@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  await User.create({
    cpfUser: patientCpf,
    nome: 'Paciente Teste',
    email: 'paciente@example.com',
    password: 'StrongP@ss123',
    ehMedico: false
  })

  const response = await client
    .post('/agenda')
    .loginVia(doctor, 'jwt')
    .send({
      doctor_cpf: doctorCpf,
      paciente_cpf: patientCpf,
      horario: '2026-10-10 10:00:00'
    })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    doctor_cpf: doctorCpf,
    paciente_cpf: patientCpf
  })
})

test('should deny agenda creation for unrelated users', async ({ client }) => {
  const doctorCpf = cpf.generate()
  const patientCpf = cpf.generate()
  const strangerCpf = cpf.generate()

  const stranger = await User.create({
    cpfUser: strangerCpf,
    nome: 'Estranho',
    email: 'estranho@example.com',
    password: 'StrongP@ss123'
  })

  const response = await client
    .post('/agenda')
    .loginVia(stranger, 'jwt')
    .send({
      doctor_cpf: doctorCpf,
      paciente_cpf: patientCpf,
      horario: '2026-10-10 10:00:00'
    })
    .end()

  response.assertStatus(403)
})

test('should list agenda for logged in user', async ({ client }) => {
  const doctorCpf = cpf.generate()
  const patientCpf = cpf.generate()

  const doctor = await User.create({
    cpfUser: doctorCpf,
    nome: 'Dr Strange',
    email: 'strange@example.com',
    password: 'StrongP@ss123',
    ehMedico: true
  })

  await Agenda.create({
    doctor_cpf: doctorCpf,
    paciente_cpf: patientCpf,
    horario: '2026-10-10 11:00:00'
  })

  const response = await client
    .get('/agenda')
    .loginVia(doctor, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    doctor_cpf: doctorCpf,
    paciente_cpf: patientCpf
  }])
})
