Naming Convention - FatoGeral

Resource Groups:
rg-<projeto>-<ambiente>
Ex: rg-fatogeral-dev, rg-fatogeral-prod

Applications:
app-<projeto>-<tipo>
Ex: app-fatogeral-backend, app-fatogeral-frontend

Database:
db-<projeto>
Ex: db-fatogeral

Key Vault (futuro):
kv-<projeto>
Ex: kv-fatogeral

Outros recursos:
<tipo>-<projeto>-<detalhe>

1o rodar o banco 
docker start fatogeral-db

2o rodar o run
./mvnw spring-boot:run -Dspring-boot.run.profiles=local