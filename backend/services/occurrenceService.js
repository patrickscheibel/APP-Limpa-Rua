const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function index(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT occurrences.id, 
            occurrences.user_id || ' - ' || users.name AS user,
            description,
            photo_url,
            latitude,
            longitude,
            date
     FROM occurrences
     JOIN users ON occurrences.user_id = users.id
     OFFSET $1 LIMIT $2`,
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(user, res) {
    const result = await db.query(
      `INSERT INTO occurrences (user_id, description, photo_url, latitude, longitude, date) VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.user_id, user.description, user.photo_url, user.latitude, user.longitude, user.date]
    );
  
    let message = "Occurrence created successfully";
  
    if (result.rowCount) {
      message = "Error in creating occurrence";    
      res.statusCode = 400;
    } else {
      res.statusCode = 200;
    }
  
    return { message };
  }
  
  async function update(user, res) {
    const columns = {
      user_id: user.user_id,
      description: user.description,
      photo_url: user.photo_url,
      latitude: user.latitude,
      longitude: user.longitude,
      date: user.date
    };
  
    const filteredColumns = Object.fromEntries(
      Object.entries(columns).filter(([key, value]) =>
      key !== 'photo_url' ? value : value && value.trim() !== ''));

    const queryValues = Object.values(filteredColumns);

    const query = `
      UPDATE occurrences 
      SET ${Object.entries(filteredColumns).map(([key], index) => `${key} = $${index + 1}`).join(", ")}
      WHERE id = $${Object.keys(filteredColumns).length + 1}
    `;

    try {
      const result = await db.query(query, [...queryValues, user.id]);
      let message = "Occurrence updated successfully";
  
      if (result.rowCount) {
        message = "Error in updating occurrence";
        res.status(400);
      } else {
        res.status(200);
      }

      return { message };
    } catch (error) {
      res.status(500);
      return { message: "Internal server error" };
    }
  }
  
  async function remove(id, res) {
    const result = await db.query(
      `DELETE FROM occurrences WHERE id=$1`,
      [id]
    );
  
    let message = "Occurrence deleted successfully";
  
    if (result.rowCount) {
      message = "Error in deleting occurrence";
      res.statusCode = 400;
    } else {
      res.statusCode = 200;
    }
  
    return { message };
  }

  async function findOccurrenceById(id, res) {
    try {
      const rows = await db.query(
        `SELECT * FROM occurrences WHERE id = $1`,
        [id]
      );
      const result = helper.emptyOrRows(rows);

      if (result.length == 0) {
        return null;
      }

      const occurrence = result[0];
      return occurrence;
    } catch (error) {
      console.error("Error finding occurrence:", error);
      throw new Error("Failed to find occurrence");
    }
  }

  module.exports = {
    index,
    create,
    update,
    remove,
    findOccurrenceById
  };