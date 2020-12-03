'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//Login
Route.post('/sessions','UserController.login')//Logar no sistema
Route.get('/user','UserController.index').middleware('auth:jwt')//Mostra todos os usuários cadastrados
Route.get('/user/:id','UserController.show').middleware('auth:jwt')//Mostra um  usuários especifico
Route.post('/user','UserController.store')//Cadastrar usuários
Route.put('/user','UserController.update').middleware("auth:jwt")// Editar o usuário
Route.get('/totalPaciente','UserController.contadorPaciente').middleware('auth:jwt')//Conta a quantidade de usuários cadastrados
Route.get('/totalMedicos','UserController.contadorMedico').middleware('auth:jwt')//Conta a quantidade de médicos cadastrados
Route.post('/agenda','AgendaController.store').middleware("auth:jwt")//Cadastrando agenda
Route.put('/agenda/:id','AgendaController.update').middleware("auth:jwt")//Editando a agenda
Route.get('/agenda','AgendaController.index').middleware('auth:jwt')//Ver toda a agenda
Route.get('/perfil','UserController.perfil').middleware('auth:jwt')//Mostra o perfil do usuário
Route.post('/agenda/:id/prontuario','ProntuarioController.store').middleware('auth:jwt')//Criando prontuário
Route.get("/dadosPaciente",'UserController.dadosPaciente').middleware('auth:jwt');//mostrar lista de pacientes
Route.get("/agendaCompleta",'UserController.agendaCompleta').middleware('auth:jwt'); //Mostra a agenda personalizada
Route.get("/prontuario",'UserController.prontuarioCompleto').middleware('auth:jwt');// Prontuario