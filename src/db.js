import path from "path";
import dotenv from "dotenv";
import util from "util";
import mysql from "mysql";

dotenv.config();

const entriesPath = path.resolve(process.env.DB_ENTRIES_LOCATION);
const usersPath = path.resolve(process.env.DB_USERS_LOCATION);

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const query = util.promisify(db.query).bind(db);

// open the MySQL connection
db.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const addEntries = async (reqBody) => {
  let id = reqBody.id;
  let name = reqBody.name;
  let email = reqBody.email;
  let phoneNumber = reqBody.phoneNumber;
  let comment = reqBody.content;
  try {
    const queryResult = await query(
      `INSERT INTO contact_entries values ('${id}', '${name}','${email}', '${phoneNumber}','${comment}')`
    );
  } catch (err) {
    console.error(err);
  }
};

const userLogin = async (email) => {
  try {
    const rows = await query(`Select * from users where email = '${email}' `);
    return rows;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addUser = async (reqBody) => {
  let id = reqBody.id;
  let name = reqBody.name;
  let email = reqBody.email;
  let password = reqBody.password;

  try {
    //let query = `INSERT INTO users VALUES (${id},${name},${email},${password})`;
    const queryResult = await query(
      `INSERT INTO users VALUES ('${id}', '${name}','${password}','${email}')`
    );
    return queryResult;
    /*
    db.query(query, [id, name, password, email], (err, result) => {
      if (err) throw err;

      return result;
    });*/
  } catch (err) {
    console.error(err);
    // next(err);
  }
};

const getData = async () => {
  try {
    const queryResult = await query(`SELECT * FROM contact_entries`);
    return queryResult;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export { addEntries, userLogin, addUser, getData };
