## Instalação das tecnologias utilizadas
```sh
apt install nodejs npm
```

```sh
npm install pm2 -g
```

### Executar o seguinte comando na pasta para instalar as dependências do Nodejs 
```sh
npm i
```

<br>

### Criar uma cópia do ".env copy" e renomear para ".env" para configurar os parâmetros de acesso na API 

<br>

### Iniciar aplicação
```sh
node index.js
```

### Iniciar aplicação em produção

```sh
pm2 start index.js
```
