const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password!",
    database: "api"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connected.");
});

var test = "test3";
var testemail = "test3@test.com";
connection.query("INSERT INTO users (name, email) VALUES (?, ?)",[test, testemail], function (err, res){
    if (err) throw err;
    console.log(res);
});