const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const userRouter = require("./routes/userRouter");
const occurrenceRouter = require("./routes/occurrenceRouter");

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4020');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get("/", (req, res) => {
  res.json({ message: 'Work' });
});

app.use("/user", userRouter);
app.use("/occurrence", occurrenceRouter);

app.use('/files', express.static(__dirname + '/files'));

// Rota para retornar o arquivo salvo
app.get('/files/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const filePath = path.join(__dirname, '/files', folder, filename);
  res.sendFile(filePath);
});

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
  
    return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});