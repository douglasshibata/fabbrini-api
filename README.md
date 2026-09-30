# Fabbrini API

<p align="center">
  <img src="https://github.com/douglasshibata/fabbrini/blob/main/src/assets/logo.png" alt="Fabbrini Logo" width="200" />
</p>

Fabbrini API é uma API REST de agendamento de consultas médicas e gestão de prontuários de saúde desenvolvida sobre a plataforma **AdonisJS v4**.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **AdonisJS Framework v4.1**
- **Lucid ORM** (PostgreSQL / SQLite)
- **JWT (JSON Web Tokens)** para autenticação
- **CPF & Password Validators** (`cpf-cnpj-validator`, `password-validator`)

---

## 🔒 Melhorias de Segurança Implementadas

1. **Proteção contra IDOR e Escala de Privilégios**:
   - Substituição de leitura insegura de dados via headers (`cpfUser`, `cpfPaciente`, `cpfDoctor`) pela identidade autenticada via token JWT (`auth.user`).
2. **Ocultação de Dados Sensíveis**:
   - O campo `password` hash é automaticamente omitido dos retornos de modelo do usuário.
3. **Validação Rigorosa de Entradas**:
   - Validação de formato e dígitos verificadores de CPF.
   - Validação de complexidade de senhas (mínimo 8 caracteres, letras maiúsculas, minúsculas, dígitos e símbolos).
   - Sanitização de nome para evitar caracteres numéricos inválidos.
4. **Controle de Acesso Baseado em Perfis (RBAC)**:
   - Apenas usuários com perfil de médico (`ehMedico: true`) podem criar e editar prontuários médicos associados às suas consultas.
   - Usuários somente têm acesso às agendas e perfis referentes a si próprios.

---

## 🚀 Instalação e Execução

### Pré-requisitos
- **Node.js** (v16+)
- **npm** (v8+)

### 1. Clonar o repositório e instalar dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd fabbrini-api
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` baseado em `.env.example`:

```env
HOST=127.0.0.1
PORT=3333
NODE_ENV=development
APP_NAME=fabbrini-api
APP_KEY=sua_chave_secreta_de_32_caracteres
DB_CONNECTION=sqlite
HASH_DRIVER=bcrypt
```

### 3. Executar Migrações do Banco de Dados
```bash
node ace migration:run
```

### 4. Iniciar a Aplicação
```bash
npm start
```
A API estará rodando em `http://127.0.0.1:3333`.

---

## 📑 Principais Rotas da API

### Autenticação & Usuários
| Método | Endpoint | Descrição | Requer Auth |
|---|---|---|---|
| `POST` | `/sessions` | Autenticação do usuário (retorna JWT) | Não |
| `POST` | `/user` | Cadastro de novo usuário/paciente | Não |
| `GET` | `/perfil` | Retorna o perfil do usuário logado | Sim |
| `PUT` | `/user` | Atualiza o perfil do usuário logado | Sim |
| `GET` | `/user` | Lista todos os usuários cadastrados | Sim |
| `GET` | `/user/:id` | Detalhes de um usuário específico | Sim |
| `GET` | `/totalPaciente` | Conta total de pacientes no sistema | Sim |
| `GET` | `/totalMedicos` | Conta total de médicos no sistema | Sim |

### Agendamentos (Agenda)
| Método | Endpoint | Descrição | Requer Auth |
|---|---|---|---|
| `POST` | `/agenda` | Cria um agendamento de consulta | Sim |
| `GET` | `/agenda` | Lista os agendamentos do usuário logado | Sim |
| `PUT` | `/agenda/:id` | Edita os dados de um agendamento | Sim |
| `GET` | `/agendaCompleta` | Visualiza a agenda detalhada (médico ou paciente) | Sim |

### Prontuários Médicos
| Método | Endpoint | Descrição | Requer Auth |
|---|---|---|---|
| `POST` | `/agenda/:id/prontuario` | Registra prontuário para uma consulta (Exclusivo Médicos) | Sim |
| `GET` | `/prontuario` | Visualiza lista completa de prontuários autorizados | Sim |

---

## 🧪 Testes Automatizados

A aplicação possui uma suíte de testes funcionais cobrindo autenticação, validação de regras de negócio e verificações de segurança.

Para rodar os testes:
```bash
npm test
```
