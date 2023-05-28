## Instalação das tecnologias utilizadas
```sh
apt install nodejs npm docker-compose
```

```sh
npm install pm2 -g
```

### Executar o seguinte comando na pasta para instalar as dependências do Nodejs 
```sh
npm i
```

### Criar o banco do dados
```sh
docker-compose up -d
```

### Acessar o banco de dados
```sh
docker exec -it <NOME_DO_CONTAINER> mysql -u<user> -p<password>
```

### Criar uma copiá do "config_example.js" e renomear para "config.js" para configurar e ter acesso ao banco de dados 


### Iniciar aplicação em produção

```sh
pm2 start index.js
```
