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
connection.query("INSERT INTO users (name, email) VALUES ('test2', 'test2@test.com')", function (err, res){
    if (err) throw err;
    console.log(res);
});