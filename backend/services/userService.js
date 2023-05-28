const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function index(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM users OFFSET $1 LIMIT $2`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function login(user, res) {
  const result = await db.query(
    `SELECT * FROM users WHERE email=$1 and password=$2`,
    [user.email, user.password]
  );

  const data = helper.emptyOrRows(result);

  let message = "Invalid email or password";

  if (data.length > 0) {
    message = "User login successfully";
    res.statusCode = 200;
  } else {
    res.statusCode = 404;
  }

  return { message };
}

async function create(user, res) {
  const result = await db.query(
    `INSERT INTO users (name, email, password, phone, cep) VALUES ($1, $2, $3, $4, $5)`,
    [user.name, user.email, user.password, user.phone, user.cep]
  );

  let message = "User created successfully";

  if (result.rowCount) {
    message = "Error in creating user";    
    res.statusCode = 400;
  } else {
    res.statusCode = 200;
  }

  return { message };
}

async function update(user, res) {
  const result = await db.query(
    `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, cep=$5 WHERE id=$6`,
    [user.name, user.email, user.password, user.phone, user.cep, user.id]
  );

  let message = "User updated successfully";

  if (result.rowCount) {
    message = "Error in updating user";
    res.statusCode = 400;
  } else {
    res.statusCode = 200;
  }

  return { message };
}

async function remove(id, res) {
  const result = await db.query(
    `DELETE FROM users WHERE id=$1`,
    [id]
  );

  let message = "User deleted successfully";

  if (result.rowCount) {
    message = "Error in deleting user";
    res.statusCode = 400;
  } else {
    res.statusCode = 200;
  }

  return { message };
}

module.exports = {
  index,
  login,
  create,
  update,
  remove
};