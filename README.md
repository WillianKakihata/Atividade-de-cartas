Documentação do Software

Visão Geral
Este software é um sistema baseado em NestJS que gerencia a criação e manipulação de cartas e baralhos. Ele inclui funcionalidades de autenticação e gerenciamento de usuários, permitindo que os usuários interajam com cartas e baralhos de maneira controlada.

Então para iniciar o projeto em nest.js
npm i
utilize npm start:dev
navegar os endpoints
localhost: http://localhost:3000/ <endpoints>

Estrutura do Projeto
O projeto é dividido em três principais controladores:

CardsController
AuthController
UsersController
1. CardsController
O CardsController gerencia as operações relacionadas às cartas e baralhos.

Endpoints
GET /cards/generate

Descrição: Gera um novo conjunto de cartas.
Autorização: Apenas usuários com o papel de Admin.
Resposta: Retorna um conjunto de cartas geradas.
Exceções:
500 Internal Server Error: Se ocorrer um erro ao gerar as cartas.
POST /cards

Descrição: Cria novas cartas baseadas nas cartas geradas.
Autorização: Usuário autenticado.
Resposta: Retorna as cartas criadas.
Exceções:
400 Bad Request: Se ocorrer um erro ao criar as cartas.
GET /cards/find

Descrição: Encontra todos os baralhos disponíveis.
Autorização: Apenas usuários com o papel de Admin.
Resposta: Retorna todos os baralhos.
Exceções:
400 Bad Request: Se ocorrer um erro ao encontrar baralhos.
GET /cards/my-decks

Descrição: Retorna os baralhos do usuário autenticado.
Autorização: Usuário autenticado.
Resposta: Retorna os baralhos do usuário.
POST /cards/import

Descrição: Importa um baralho via JSON.
Autorização: Usuário autenticado.
Resposta: Retorna o baralho importado.
Exceções:
400 Bad Request: Se ocorrer um erro ao importar o baralho.
2. AuthController
O AuthController gerencia a autenticação dos usuários.

Endpoints
POST /auth/login
Descrição: Realiza o login do usuário.
Requisição: Deve conter username e password no corpo da solicitação.
Resposta: Retorna um token de autenticação se bem-sucedido.
Exceções:
401 Unauthorized: Se as credenciais estiverem incorretas.
3. UsersController
O UsersController gerencia as operações relacionadas aos usuários.

Endpoints
POST /user

Descrição: Cria um novo usuário.
Requisição: Deve conter os dados do usuário no corpo da solicitação.
Resposta: Mensagem de sucesso se o usuário for criado.
Exceções:
409 Conflict: Se o usuário já existir.
500 Internal Server Error: Se ocorrer um erro inesperado.
POST /user/

Descrição: Atualiza os dados de um usuário existente.
Requisição: Deve conter os novos dados do usuário no corpo da solicitação.
Parâmetro: username - Nome de usuário do usuário a ser atualizado.
Resposta: Mensagem de sucesso se o usuário for atualizado.
Exceções:
500 Internal Server Error: Se ocorrer um erro inesperado.
DELETE /user/

Descrição: Remove um usuário.
Parâmetro: username - Nome de usuário do usuário a ser removido.
Resposta: 204 No Content se a remoção for bem-sucedida.
Exceções:
500 Internal Server Error: Se ocorrer um erro inesperado.
Exceções Personalizadas
UserAlreadyExistsException: Lançada quando uma tentativa de criar um usuário com um nome de usuário que já existe é realizada.
Considerações Finais
Esta documentação fornece uma visão geral dos principais controladores e suas funcionalidades. Para mais detalhes sobre a implementação, consulte o código-fonte do projeto. Caso haja necessidade de ajustes ou novas funcionalidades, recomenda-se a revisão da lógica de negócios e das validações.

