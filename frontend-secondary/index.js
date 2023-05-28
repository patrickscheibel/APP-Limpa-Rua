require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const api_url = process.env.API_URL;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para a página de login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Rota para lidar com o envio do formulário de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar se os campos obrigatórios foram preenchidos
  if (!email || !password) {
    return res.status(400).send('Email de usuário e senha são obrigatórios.');
  }
  
  // Fazer a requisição para a API de login
  axios.post(`${api_url}/user/login`, { email, password })
    .then(response => {
      res.redirect('/dashboard');
    })
    .catch(error => {
      res.redirect('/');
    });
});

// Rota para a página de dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

// Rota para a página de users
app.get('/users', (req, res) => {
  res.sendFile(__dirname + '/users.html');
});

// Rota para a página de occurrences
app.get('/occurrences', (req, res) => {
  res.sendFile(__dirname + '/occurrences.html');
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});