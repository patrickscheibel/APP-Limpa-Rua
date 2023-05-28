const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

async function query(sql, params) {
  const client = await pool.connect();
  try {
        const result = await client.query(sql, params);
        return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  query
}