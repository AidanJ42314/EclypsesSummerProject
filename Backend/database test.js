const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "api"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connected.");
});

var test = "test3";
var testemail = "test3@test.com";
dbq("INSERT INTO users (name, email) VALUES (?, ?)",[test, testemail], function (err, res){
    if (err) throw err;
    console.log(res);
});