# FatoGeral

> Aplicação web de checagem de fatos comunitária com apoio de IA.

---

## Equipe

| Nome |
|------|
| André Luís Gomes da Silva Filho |
| Arthur Azevedo Costa de Paula |
| Artur Francisco Damascena |
| Hallason Matias da Silva |
| Dayvson da Conceição de Moura |

---

## Descrição

O **FatoGeral** permite que usuários colem textos ou links suspeitos e recebam uma análise de veracidade em tempo real, utilizando IA (Google Gemini). O sistema também oferece um painel público de tendências e um módulo administrativo para moderação.

---

## Tecnologias e Versões

### Backend
| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.6 |
| Spring Data JPA | 4.0.6 |
| Spring Security | 4.0.6 |
| Flyway | 11.14.1 |
| PostgreSQL Driver | 42.7.10 |
| JJWT | 0.12.6 |
| Lombok | latest |
| SpringDoc OpenAPI | 2.8.9 |

### Frontend
| Tecnologia | Versão |
|---|---|
| Node.js | 20+ |
| React | 19 |
| TypeScript | 5.x |
| Vite | 8.x |
| React Router | 7.x |
| Axios | latest |
| Tailwind CSS | 4.x |
| React Hot Toast | latest |

### IA
| Item | Detalhe |
|---|---|
| Provedor | Google Gemini |
| Modelo | gemini-2.5-flash |
| API | Google AI Studio (generativelanguage.googleapis.com) |

### Infraestrutura
| Serviço | Uso |
|---|---|
| Azure App Service (Free F1) | Hospedagem do backend |
| Azure Static Web Apps (Free) | Hospedagem do frontend |
| Render PostgreSQL | Banco de dados em produção |

---

## Como Executar Localmente

### Pré-requisitos

- Java 21+
- Node.js 20+
- Docker

### Backend

**1. Sobe o banco de dados local:**
```bash
docker run --name fatogeral-db \
  -e POSTGRES_DB=fatogeral \
  -e POSTGRES_USER=fatogeral \
  -e POSTGRES_PASSWORD=fatogeral \
  -p 5432:5432 \
  -d postgres:16
```

**2. Entre na pasta do backend:**
```bash
cd backend
```

**3. Execute o projeto com perfil local:**
```bash
DB_USERNAME=fatogeral DB_PASSWORD=fatogeral ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

O backend sobe na porta **8080**.

**4. Verifique se está rodando:**
```bash
curl http://localhost:8080/health
# Resposta esperada: OK
```

**5. Acesse a documentação Swagger:**
```
http://localhost:8080/swagger-ui.html
```

---

### Frontend

**1. Entre na pasta do frontend:**
```bash
cd frontend
```

**2. Crie o arquivo de variáveis de ambiente:**
```bash
echo "VITE_API_URL=http://localhost:8080" > .env.local
```

**3. Instale as dependências:**
```bash
npm install
```

**4. Execute o projeto:**
```bash
npm run dev
```

O frontend sobe na porta **5173**.

Acesse: [http://localhost:5173](http://localhost:5173)

---

## Variáveis de Ambiente

### Backend (produção)

| Variável | Descrição |
|---|---|
| `DB_USERNAME` | Usuário do banco PostgreSQL |
| `DB_PASSWORD` | Senha do banco PostgreSQL |
| `DB_URL` | URL de conexão JDBC do banco |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT |
| `JWT_EXPIRATION` | Tempo de expiração do token em ms (padrão: 86400000) |
| `GEMINI_API_KEY` | Chave de API do Google Gemini |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas pelo CORS |
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (`local`, `dev` ou `prod`) |

### Frontend

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base do backend |

---

## URLs de Produção

| Serviço | URL |
|---|---|
| Frontend | https://witty-meadow-0da24670f.7.azurestaticapps.net |
| Backend | https://fatogeral-backend-ebcjhvg7cdesgwdj.eastus-01.azurewebsites.net |
| Swagger | https://fatogeral-backend-ebcjhvg7cdesgwdj.eastus-01.azurewebsites.net/swagger-ui.html |

---

## Estrutura do Projeto

```
FatoGeral/
├── backend/
│   ├── src/main/java/com/fatogeral/backend/
│   │   ├── config/          # Configurações (Security, CORS, Swagger)
│   │   ├── controller/      # Controllers REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entidades JPA
│   │   ├── integration/     # Integração com IA (Gemini)
│   │   ├── repository/      # Repositórios Spring Data
│   │   ├── security/        # JWT Filter e Service
│   │   └── service/         # Lógica de negócio
│   └── src/main/resources/
│       ├── application.yml
│       ├── application-local.yml
│       ├── application-dev.yml
│       ├── application-prod.yml
│       └── db/migration/    # Migrations Flyway
└── frontend/
    └── src/
        ├── components/      # Componentes reutilizáveis
        ├── contexts/        # AuthContext
        ├── hooks/           # Custom hooks
        ├── pages/           # Páginas da aplicação
        ├── router/          # Configuração de rotas
        ├── services/        # Chamadas à API
        └── types/           # Tipos TypeScript
```

---

## Principais Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Cadastro de usuário | Público |
| POST | `/auth/login` | Login | Público |
| GET | `/health` | Health check | Público |
| GET | `/trends` | Tendências públicas | Público |
| POST | `/analysis` | Criar análise | USER |
| GET | `/analysis/{id}` | Buscar análise | USER |
| GET | `/analysis/history` | Histórico do usuário | USER |
| PUT | `/analysis/{id}/review` | Revisar análise | ADMIN |
| GET | `/admin/analyses` | Listar todas análises | ADMIN |

---


**FatoGeral — Combatendo a desinformação com tecnologia.**