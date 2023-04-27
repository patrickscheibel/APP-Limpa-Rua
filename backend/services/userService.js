const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function index(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM users LIMIT ${offset},${config.listPerPage}`
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
    `SELECT * FROM users WHERE email="${user.email}" and password="${user.password}"`
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
    `INSERT INTO users 
    (name, email, password, phone, cep) 
    VALUES 
    ("${user.name}", "${user.email}", "${user.password}", "${user.phone}", "${user.cep}")`
  );

  let message = "Error in creating user";

  if (result.affectedRows) {
    message = "User created successfully";
    res.statusCode = 200;
  } else {
    res.statusCode = 500;
  }

  return { message };
}

async function update(user, res) {
  const result = await db.query(
    `UPDATE users
    SET name="${user.name}", email="${user.email}", password="${user.password}", phone="${user.phone}", cep="${user.cep}"
    WHERE id=${user.id}`
  );

  let message = "Error in updating user";

  if (result.affectedRows) {
    message = "User updated successfully";
    res.statusCode = 200;
  } else {
    res.statusCode = 404;
  }

  return { message };
}

async function remove(id, res) {
  const result = await db.query(
    `DELETE FROM users WHERE id=${id}`
  );

  let message = "Error in deleting user";

  if (result.affectedRows) {
    message = "User deleted successfully";
    res.statusCode = 200;
  } else {
    res.statusCode = 404;
  }

  return { message };
}

module.exports = {
  index,
  login,
  create,
  update,
  remove
}