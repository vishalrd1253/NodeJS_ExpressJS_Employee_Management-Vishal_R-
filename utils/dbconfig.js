const mysql = require('mysql2');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.HOST ,
  user: process.env.USER ,
  password: process.env.PASSWORD ,
  database: process.env.NAME ,
  port: process.env.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false 
  }
}).promise();


module.exports =  pool 

