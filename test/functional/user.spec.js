'use strict'

const { test, trait } = use('Test/Suite')('User Controller')
const User = use('App/Models/User')
const { cpf } = require('cpf-cnpj-validator')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

test('should register a new user successfully', async ({ client }) => {
  const validCpf = cpf.generate()
  const response = await client
    .post('/user')
    .send({
      cpfUser: validCpf,
      nome: 'Maria Silva',
      email: 'maria@example.com',
      password: 'StrongP@ss123'
    })
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    email: 'maria@example.com',
    nome: 'Maria Silva'
  })
})

test('should fail registration with invalid CPF', async ({ client }) => {
  const response = await client
    .post('/user')
    .send({
      cpfUser: '12345678900',
      nome: 'João Silva',
      email: 'joao@example.com',
      password: 'StrongP@ss123'
    })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    message: { error: 'CPF inválido' }
  })
})

test('should fail registration with weak password', async ({ client }) => {
  const validCpf = cpf.generate()
  const response = await client
    .post('/user')
    .send({
      cpfUser: validCpf,
      nome: 'Ana Costa',
      email: 'ana@example.com',
      password: '123'
    })
    .end()

  response.assertStatus(400)
})

test('should fail registration with duplicate email', async ({ client }) => {
  const validCpf1 = cpf.generate()
  const validCpf2 = cpf.generate()

  await client
    .post('/user')
    .send({
      cpfUser: validCpf1,
      nome: 'Carlos Souza',
      email: 'carlos@example.com',
      password: 'StrongP@ss123'
    })
    .end()

  const response = await client
    .post('/user')
    .send({
      cpfUser: validCpf2,
      nome: 'Carlos Santos',
      email: 'carlos@example.com',
      password: 'StrongP@ss123'
    })
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    message: { error: 'Email Já Cadastrado' }
  })
})

test('should login user and return JWT token', async ({ client }) => {
  const validCpf = cpf.generate()
  await User.create({
    cpfUser: validCpf,
    nome: 'Pedro Alves',
    email: 'pedro@example.com',
    password: 'StrongP@ss123'
  })

  const response = await client
    .post('/sessions')
    .send({
      cpfUser: validCpf,
      password: 'StrongP@ss123'
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    type: 'bearer'
  })
})

test('should fetch profile of logged in user and not expose password', async ({ client }) => {
  const validCpf = cpf.generate()
  const user = await User.create({
    cpfUser: validCpf,
    nome: 'Julia Lima',
    email: 'julia@example.com',
    password: 'StrongP@ss123'
  })

  const response = await client
    .get('/perfil')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    email: 'julia@example.com',
    nome: 'Julia Lima'
  })

  if (response.body.password) {
    throw new Error('Password field exposed in profile response')
  }
})

test('should update profile for logged in user', async ({ client }) => {
  const validCpf = cpf.generate()
  const user = await User.create({
    cpfUser: validCpf,
    nome: 'Fernanda Rocha',
    email: 'fernanda@example.com',
    password: 'StrongP@ss123'
  })

  const response = await client
    .put('/user')
    .loginVia(user, 'jwt')
    .send({
      nome: 'Fernanda Rocha Santos',
      telefone: '11999998888'
    })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    nome: 'Fernanda Rocha Santos',
    telefone: '11999998888'
  })
})
