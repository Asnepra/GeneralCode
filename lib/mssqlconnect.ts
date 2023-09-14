const sql = require('mssql')
let db_config= require('./dbconfig');

export default async function connectToDatabase() {
    try {
          await sql.connect(db_config);
        //console.log("Connected to the MS SQL database");
    } catch (error) {
      console.error("Connect to DB Error Error connecting to the database:", error);
    }
  }