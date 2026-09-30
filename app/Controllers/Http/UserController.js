'use strict'

//Para criar um controller adonis make:controller User --type http
const User = use("App/Models/User");
const Database = use('Database');
//Validador de cpf
const { cpf } = require('cpf-cnpj-validator');
// Validador de Senha
const PasswordValidator = require('password-validator');

function getPasswordSchema () {
  const schema = new PasswordValidator();
  return schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().symbols(1)
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123','12345','senha']); // Blacklist these values
}

class UserController {
  async store ({ request, response }) {
    try {
      // Pega os dados e cadastra
      const data = request.only(['cpfUser', 'nome', 'email', 'password', 'telefone', 'conselho', 'ufConselho', 'registro', 'especialidade', 'ehMedico']);

      if (!data.cpfUser || !cpf.isValid(data.cpfUser)) {
        return response
          .status(400)
          .send({ message: { error: 'CPF inválido' } });
      }

      const cleanCpf = data.cpfUser.replace(/\D/g, '');
      data.cpfUser = cleanCpf;

      //verifica se o email já está cadastrado
      const userEmailExists = await User.findBy('email', data.email);
      if (userEmailExists) {
        return response
          .status(400)
          .send({ message: { error: 'Email Já Cadastrado' } });
      }

      //Verifica se o cpf já está cadastrado
      const userCpfExists = await User.findBy('cpfUser', data.cpfUser);
      if (userCpfExists) {
        return response
          .status(400)
          .send({ message: { error: 'CPF Já Cadastrado' } });
      }

      if (data.nome && /\d/.test(data.nome)) {
        return response
          .status(400)
          .send({ message: { error: 'Nome não pode conter números' } });
      }

      const passwordSchema = getPasswordSchema();
      if (!passwordSchema.validate(data.password)) {
        return response
          .status(400)
          .send({ message: { error: 'Senha Fraca, deve ter no mínimo 8 caracteres tem que ter no mínimo 1 letra Maiuscula Dois Digitos Sem espaço' } });
      }     

      const user = await User.create(data);
      return response.status(201).json(user);
    } catch (error) {
      const status = error.status || 500;
      return response
        .status(status)
        .send({ message: { error: error.message || 'Erro interno do servidor' } });
    }
  }

  async index () {
    const user = await User.all();
    return user;
  }

  async show ({ params }) {
    const user = await User.findOrFail(params.id);
    return user;
  }

  async update ({ request, auth, response }) {
    try {
      const user = auth.user;
      
      const data = request.only([
        'email',
        'password',
        'nome',
        'telefone',
        'conselho',
        'ufConselho',
        'registro',
        'especialidade'
      ]);

      if (data.password) {
        const passwordSchema = getPasswordSchema();
        if (!passwordSchema.validate(data.password)) {
          return response
            .status(400)
            .send({ message: { error: 'Senha Fraca' } });
        }
      }

      if (data.nome && /\d/.test(data.nome)) {
        return response
          .status(400)
          .send({ message: { error: 'Nome não pode conter números' } });
      }

      user.merge(data);
      await user.save();
      return user;
    } catch (error) {
      const status = error.status || 500;
      return response
        .status(status)
        .send({ message: { error: error.message || 'Erro ao atualizar usuário' } });
    }
  }

  async login ({ request, auth }) {
    const { cpfUser, password } = request.all();
    const cleanCpf = cpfUser ? cpfUser.replace(/\D/g, '') : cpfUser;
    const token = await auth.attempt(cleanCpf, password);
    return token;
  }

  async contadorPaciente () {
    const contador = await User.query().where('ehPaciente', true).count();
    return contador;
  }

  async contadorMedico () {
    const contador = await User.query().where('ehMedico', true).count();
    return contador;
  }

  async perfil ({ auth }) {
    return auth.user;
  }

  async agendaCompleta ({ auth }) {
    const user = auth.user;
    if (user.ehMedico) {
      const data = await Database
        .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" ), N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail", users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id where n1."doctor_cpf" = ? ;', [user.cpfUser]);
      return data;
    } else {
      const data = await Database
        .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" ), N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail", users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id where n2."paciente_cpf" = ? ;', [user.cpfUser]);
      return data;
    }
  }

  async prontuarioCompleto ({ auth }) {
    const user = auth.user;
    if (user.ehMedico) {
      const data = await Database
        .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario, prontuarios.prontuario , prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" inner join prontuarios on prontuarios.agenda_id= agenda.id ), N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail", users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id where n1."doctor_cpf" = ? ;', [user.cpfUser]);
      return data;
    } else {
      const data = await Database
        .raw('WITH N1 AS (select users."cpfUser" as "doctor_cpf", users.email as "profissionalEmail", users.nome as "profissionalNome", users.telefone as "profissionalTelefone", users.conselho, users."ufConselho" , users.registro , agenda.id, users.especialidade , agenda.horario,prontuarios.prontuario , prontuarios.created_at as "prontuarioCriado" FROM users inner join agenda on agenda.doctor_cpf = users."cpfUser" inner join prontuarios on prontuarios.agenda_id= agenda.id ), N2 AS ( select users."cpfUser" as "paciente_cpf", users.email as "pacienteEmail", users.nome as "pacienteNome", agenda.id as "agendaId", agenda.horario FROM users inner join agenda on agenda.paciente_cpf = users."cpfUser" ) SELECT distinct n2.*,n1.* from N2 inner join n1 on n2."agendaId" = n1.id where n2."paciente_cpf" = ? ;', [user.cpfUser]);
      return data;
    }
  }
}

module.exports = UserController;
