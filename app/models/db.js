const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
//Create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//Open the MySQL connection
connection.connect(error => {
    if (error) {
        console.log(error);
    }
    console.log("Connected to the database");
});

module.exports = connection;