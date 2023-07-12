const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', // or your MySQL server hostname
  user: 'root', // or your MySQL username
  database: 'myride_db', // the name of your MySQL database
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;