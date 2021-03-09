const mysql = require('mysql2');

var dbconnection = {
	dbhost: "dbuser",
	dbuser: "dbpass",
	dbpass: "",
	port: 3306,
	db: "pureftp"
}

const pool = mysql.createPool({
  host: dbconnection.dbhost,
  user: dbconnection.dbuser,
  password: dbconnection.dbpass,
  database: dbconnection.db,
  port: dbconnection.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const dbclient = pool.promise();

const db = {
  config: dbconnection,
  connection: dbclient
}

module.exports = db;