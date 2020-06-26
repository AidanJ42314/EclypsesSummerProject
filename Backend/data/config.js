//configuration for the api database
const mysql = require("mysql");
const config = {
    host: "localhost",
    user: "root",
    password: "Dragonslayer420",
    database: "api",
};

//create a pool with the database
const pool = mysql.createPool(config);

//export the pool
module.exports = pool;