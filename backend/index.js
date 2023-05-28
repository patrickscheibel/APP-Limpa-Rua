const express = require("express");
const app = express();
const port = 3000;
const userRouter = require("./routes/userRouter");

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
  res.json({ message: "ok" });
});

app.use("/user", userRouter);

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