# 🧱 TaskDock API

> 🚧 **Em construção** 🚧
> Uma API RESTful desenvolvida com Node.js e Express, responsável pela autenticação de usuários e operações de CRUD de produtos.
Este serviço faz parte do TaskDock, um sistema full-stack totalmente conteinerizado com Docker.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT com HttpOnly Cookies
- Docker & Docker Compose
- Helmet + CORS

---

## 🧩 Arquitetura do Projeto

A API foi construída seguindo uma arquitetura em 3 camadas, garantindo organização, manutenção simples e baixo acoplamento:

- Routes → Roteamento da API
- Controllers → Recebem requisições e enviam respostas
- Services → Regras de negócio
- Repositories → Acesso ao banco

<div align="center">
  <img src="./public/architecture-diagram.v2.png" alt="System Architecture Diagram" width="700" />
  <img width="700" height="901" alt="image" src="https://github.com/user-attachments/assets/f65e1d39-0396-4cc9-8691-644ff8c82887" />

</div>

### Data Flow

<div align="center">
  <img src="./public/diagram.png" alt="System Architecture Diagram" width="700" />
</div>

---
