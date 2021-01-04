'use strict'
//Para criar um controller adonis make:controller User --type http
const User = use("App/Models/User");
const Database = use('Database');
//Validador de cpf
const { cpf } =require('cpf-cnpj-validator'); 
// Validador de Senha
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
const Hash = use('Hash')


class UserController {
  async store({ request ,response}) {
    try {
      // Pega os dados e cadastra
      const data = request.only(['cpfUser', 'nome' ,'email', 'password']);
      //verifica se o email já está cadastrado
      const userEmailExists = await User.findBy('email', data.email)
      //Verifica se o cpf já está cadastrado
      const userCpfExists = await User.findBy('cpfUser', data.cpfUser)
      if(!cpf.isValid(data.cpfUser)){
        console.log(cpf.generate());
        return response
          .status(400)
          .send({ message: { error: 'CPF inválido' } })
      }
      if (userEmailExists) {
        return response
          .status(400)
          .send({ message: { error: 'Email Já Cadastrado' } })
      }
      if (userCpfExists) {
        return response
          .status(400)
          .send({ message: { error: 'CPF Já Cadastrado' } })
      }
      schema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase([1])                           // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
      .has().symbols([1])	
      .has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123','12345','senha']); // Blacklist these values
      if(!schema.validate(data.password)){
        return response
        .status(400)
        .send({ message: { error: 'Senha Fraca, deve ter no mínimo 8 caracteres tem que ter no mínimo 1 letra Maiuscula Dois Digitos Sem espaço' } })
      }
      const user = await User.create(data);
  
      return user;  
    } catch (error) {
      return response
      .status(error.status)
      .send(error)
    }
  };
  async index() {
    const user = User.all()

    return user
  };
   /**
   * Display a single doctor.
   * GET doctors/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const user = await User.findOrFail(params.id)

    return user
  }

  async update({ request,response}) {
    try {
      const user = await User.findByOrFail("cpfUser", request.header("cpfUser"));
      
      const data = request.only([
        'email',
        'password',
        'nome',
        'telefone',
        'conselho',
        'ufConselho',
        'registro',
        'especialidade',
        'ativo',
        'ehMedico',
      ])
      const passwordCheck = await Hash.verify(data.password, user.password)
      
    if (!passwordCheck) {
      return response
        .status(400)
        .send({ message: { error: 'Senha Incorreta' } })
    }
  
      user.merge(data)
  
      await user.save()
     console.log(user);
      return user
    } catch (error) {
      console.log(error);
    }


  }
  /* async destroy ({ params, auth, response }) {
    const user = await User.findOrFail(params.id)

    if (user.user_id !== auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' })
    }

    await user.delete()
  } */
  async login({request,auth}){
      const {cpfUser,password} = request.all();
      const token = await auth.attempt(cpfUser,password);
      return token;
  }
  async contadorPaciente(){
    const contador = await  User.query().where('ehPaciente',true).getCount()
    return contador;
  }
  async contadorMedico(){
    const contador = await User.query().where('ehMedico',true).getCount()
    return contador
  }
  async perfil({request}){
    const user = await User.findByOrFail('cpfUser',request.header('cpfUser'))
    //.from('users').select('*').where('cpfUser',request.header('cpfUser'))
    return user
  }
  async dadosPaciente(){
    const dados = await Database.select('*').from('users');
    return dados;
  }
  async agendaCompleta({request}){
    const user = await User.findByOrFail('cpfUser',request.header('cpfUser'))
    if(user.ehMedico){
      const data = await Database
      .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" ),   N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n1."doctor_cpf" = ? ;',[user.cpfUser])  
      return data
    }else{
      const data = await Database
      .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" ),   N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n2."paciente_cpf" = ? ;',[user.cpfUser])  
      return data
    }
  }
  async prontuarioCompleto({request}){
    const user = await User.findByOrFail('cpfUser',request.header('cpfUser'))
    if(user.ehMedico){
      const data = await Database
      .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario, prontuarios.prontuario , prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" 	inner join prontuarios on prontuarios.agenda_id= agenda.id ),   N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n1."doctor_cpf" = ? ;',[user.cpfUser])  
      return data
    }else{
      const data = await Database
      .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario,prontuarios.prontuario ,  prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" inner join prontuarios on prontuarios.agenda_id= agenda.id  ),   N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n2."paciente_cpf" = ? ;',[user.cpfUser])  
      return data
    }
  }
}

module.exports = UserController
