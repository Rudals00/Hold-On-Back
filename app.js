const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 8000;
const morgan = require('morgan');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App server is running at https://localhost:${port}`);
});

const mysql = require('mysql');
const dbConfig = {
    host: '192.168.56.1',
    port: '3306',
    user: 'root',
    password: 'rudals789',
    database: 'mydb'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

module.exports = connection;