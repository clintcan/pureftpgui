const dbcon = require('./dbcon.js');

console.log("starting installer");

'use strict';

const mysql = require('mysql2');
const {promisify} = require('util');
const readFile = promisify(require('fs').readFile);

async function runSQL(filename, myhost, myuser, mypass) {
  const connection = mysql.createConnection({
    host: myhost,
    user: myuser,
    password: mypass,
    multipleStatements: true
  });

  connection.connect();

  const sql = await readFile(filename, 'utf8');

  connection.query(sql, err => {
    if (err) throw err;

    console.log('Query run successfully');
  });

  connection.end();
}

// We will use the configuration in dbcon.js

var config = dbcon.config;

runSQL('./pureftp.sql',config.dbhost,config.dbuser,config.dbpass);