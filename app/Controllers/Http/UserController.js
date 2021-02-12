'use strict'
//Para criar um controller adonis make:controller User --type http
const User = use("App/Models/User");
//Validador de cpf
const { cpf } =require('cpf-cnpj-validator'); 
// Validador de Senha
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
// const Hash = use('Hash')
// const Database = use('Database')
// const mongoClient = await Database.connect()

class UserController {
  async store({ request ,response}) {
    try {
      // Pega os dados e cadastra
      const data = request.only([
        'cpfNumber',
        'cpfImages',
        'firstName',
        'familyName',
        'socialName',
        'title',
        'email', 
        'senha',
        'telefone',
        'rgNumber',
        'rgExpedition',
        'rgExpeditor',
        'rgExpeditorUf',
        'rgImages',
        'endZIP',
        'endState',
        'endCity',
        'endDistrict',
        'endDirection',
        'endComplement',
        'telefoneNumero',
        'telefoneTipo',
        'ehMedico',
      ]);
      //verifica se o email já está cadastrado
      const userEmailExists = await User.findBy('email', data.email)
      //Verifica se o cpf já está cadastrado
      const userCpfExists = await User.findBy('cpfNumber', data.cpfNumber)
      if(!cpf.isValid(data.cpfNumber)){
        return response
          .status(400)
          .send({ message: { error: 'CPF inválido' } })
      }
      if (userCpfExists) {
        return response
          .status(400)
          .send({ message: { error: 'CPF Já Cadastrado' } })
      }
      if (userEmailExists) {
        return response
          .status(400)
          .send({ message: { error: 'Email Já Cadastrado' } })
      }
      if(/\d/.test(data.firstName)){
        return response
        .status(400)
        .send({ message: { error: 'Nome não pode conter números' } })
      }
      if(data.firstName>5){
        return response
        .status(400)
        .send({ message: { error: 'Nome não pode ter menos que 5 caracteres ' } })
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
      if(!schema.validate(data.senha)){
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
    const user = await User.all()

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
    const user =  await User.where('_id',params.id ).fetch()
    return user
  }

  async update({ request,response}) {
    try {
      const user = await User.findByOrFail("cpfNumber", request.header("cpfNumber"));
      
      const data = request.only([
        'cpfNumber',
        'cpfImages',
        'firstName',
        'familyName',
        'socialName',
        'title',
        'email', 
        'senha',
        'telefone',
        'rgNumber',
        'rgExpedition',
        'rgExpeditor',
        'rgExpeditorUf',
        'rgImages',
        'endZIP',
        'endState',
        'endCity',
        'endDistrict',
        'endDirection',
        'endComplement',
        'telefoneNumero',
        'telefoneTipo',
        'conselho',
        'ufConselho',
        'registro',
        'especialidade',
        'ativo',
        'ehMedico',
      ])
    //   const passwordCheck = await Hash.verify(data.password, user.password)
      
    // if (!passwordCheck) {
    //   return response
    //     .status(400)
    //     .send({ message: { error: 'Senha Incorreta' } })
    // }
  
      user.merge(data)
  
      await user.save()
     console.log(user);
      return user
    } catch (error) {
      console.log(error);
    }


  }
  // async destroy ({ params, auth, response }) {
  //   const user =  await User.where('_id',params.id ).fetch()

  //   if (user.user_id !== auth.user.id) {
  //     return response.status(401).send({ error: 'Não Autorizado' })
  //   }

  //   await user.deleteOne({'_id':params.id })
  // }
  async login({request,auth,response}){
      const {cpfNumber,senha} = request.all();
      const checaCPF = await User.findBy('cpfNumber',cpfNumber)
      if(!checaCPF || checaCPF === null){
        return response
          .status(400)
          .send({ message: { error: 'CPF não encontrado' } })
      }
      const token = await auth.withRefreshToken().attempt(cpfNumber,senha);
      return token
    }
  // async contadorPaciente(){
  //   const contador = await  User.where('ehPaciente',true).count()
  //   return contador;
  // }
  // async contadorMedico(){
  //   const contador = await User.where('ehMedico',true).count()
  //   return contador
  // }
  async perfil({request}){
    const user =  await User.where('cpfNumber', request.header('cpfNumber')).fetch()

    //const user =  await User.where('cpfNumber', request.header('cpfNumber')).fetch()
    //const user = await User.findByOrFail('cpfNumber',request.header('cpfNumber'))
    //.from('users').select('*').where('cpfNumber',request.header('cpfNumber'))
    return user
  }
  // async dadosPaciente(){
  //   const dados = await User.all()//.select('*').from('users');
  //   return dados;
  // }
  async agendaCompleta({request}){
    // const user = await User.findByOrFail('cpfNumber',request.header('cpfNumber'))
    // if(user.ehMedico){
    //   const data = await Database
    //   .raw('WITH N1 AS (select users."cpfNumber" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfNumber" ),   N2 AS ( select users."cpfNumber" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfNumber" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n1."doctor_cpf" = ? ;',[user.cpfNumber])  
    //   return data
    // }else{
    //   const data = await Database
    //   .raw('WITH N1 AS (select users."cpfNumber" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfNumber" ),   N2 AS ( select users."cpfNumber" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfNumber" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n2."paciente_cpf" = ? ;',[user.cpfNumber])  
    //   return data
    // }
  }
  async prontuarioCompleto({request}){
    // const user = await User.findByOrFail('cpfNumber',request.header('cpfNumber'))
    // if(user.ehMedico){
    //   const data = await Database
    //   .raw('WITH N1 AS (select users."cpfNumber" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario, prontuarios.prontuario , prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfNumber" 	inner join prontuarios on prontuarios.agenda_id= agenda.id ),   N2 AS ( select users."cpfNumber" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfNumber" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n1."doctor_cpf" = ? ;',[user.cpfNumber])  
    //   return data
    // }else{
    //   const data = await Database
    //   .raw('WITH N1 AS (select users."cpfNumber" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario,prontuarios.prontuario ,  prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfNumber" inner join prontuarios on prontuarios.agenda_id= agenda.id  ),   N2 AS ( select users."cpfNumber" as "paciente_cpf", users.email as "pacienteEmail",  users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfNumber" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id  where n2."paciente_cpf" = ? ;',[user.cpfNumber])  
    //   return data
    // }
  }
}

module.exports = UserController
