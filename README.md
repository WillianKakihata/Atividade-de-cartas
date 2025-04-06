# 🃏 Sistema de Gerenciamento de Cartas e Baralhos (NestJS)

Este projeto é uma API RESTful desenvolvida com **NestJS**, focada no gerenciamento de **cartas** e **baralhos**, com autenticação de usuários e controle de permissões.

## 🚀 Visão Geral

O sistema permite que usuários criem, importem e manipulem cartas e baralhos. Possui autenticação baseada em **JWT** e gerenciamento de usuários, com restrições de acesso baseadas em papéis (Admin e Usuário).

---

## 🛠️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- TypeScript
- JWT (para autenticação)
- Class Validator (validações)
- Docker (opcional)

---

## ▶️ Como Executar o Projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

3. Acesse a API via:  
[http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

- `cards/`: Gerenciamento de cartas e baralhos
- `auth/`: Lógica de autenticação
- `user/`: Operações com usuários

---

## 📌 Endpoints

### 📄 CardsController

#### `GET /cards/generate`
- **Descrição:** Gera um novo conjunto de cartas.
- **Permissão:** Admin
- **Resposta:** Cartas geradas.
- **Erros:** `500 Internal Server Error`

#### `POST /cards`
- **Descrição:** Cria cartas com base nas cartas geradas.
- **Permissão:** Autenticado
- **Resposta:** Cartas criadas.
- **Erros:** `400 Bad Request`

#### `GET /cards/find`
- **Descrição:** Lista todos os baralhos disponíveis.
- **Permissão:** Admin
- **Resposta:** Lista de baralhos.
- **Erros:** `400 Bad Request`

#### `GET /cards/my-decks`
- **Descrição:** Retorna os baralhos do usuário autenticado.
- **Permissão:** Autenticado
- **Resposta:** Baralhos do usuário.

#### `POST /cards/import`
- **Descrição:** Importa um baralho a partir de um JSON.
- **Permissão:** Autenticado
- **Resposta:** Baralho importado.
- **Erros:** `400 Bad Request`

---

### 🔐 AuthController

#### `POST /auth/login`
- **Descrição:** Realiza login do usuário.
- **Body:** `{ "username": "user", "password": "pass" }`
- **Resposta:** Token JWT
- **Erros:** `401 Unauthorized`

---

### 👤 UsersController

#### `POST /user`
- **Descrição:** Cria um novo usuário.
- **Body:** Dados do novo usuário.
- **Resposta:** Sucesso.
- **Erros:** `409 Conflict`, `500 Internal Server Error`

#### `POST /user/:username`
- **Descrição:** Atualiza dados do usuário.
- **Body:** Novos dados.
- **Parâmetro:** `username`
- **Resposta:** Sucesso.
- **Erros:** `500 Internal Server Error`

#### `DELETE /user/:username`
- **Descrição:** Remove um usuário.
- **Parâmetro:** `username`
- **Resposta:** `204 No Content`
- **Erros:** `500 Internal Server Error`

---

## ❗ Exceções Personalizadas

- **`UserAlreadyExistsException`**: Lançada quando o nome de usuário já está em uso.

---

## 🧪 Testes

Execute os testes com:

```bash
npm run test
```

---

## 📌 Considerações Finais

Este projeto foi desenvolvido com foco na modularidade, escalabilidade e segurança. Para detalhes mais técnicos, consulte o código-fonte. Caso precise de novas funcionalidades, recomenda-se revisar a lógica de negócios e as validações associadas.

---

## 📬 Contato

Em caso de dúvidas, sugestões ou contribuições, sinta-se à vontade para abrir uma issue ou enviar um pull request.
