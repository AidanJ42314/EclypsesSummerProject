//dependencies -- we probably need to install these on the server, but i'm not sure
//if we do, the command is 'npm install express body-parser mysql request'
const express = require('express');
const routes = require('./routes/routes');
const port = 3001;
const app = express();
const body_parser = require("body-parser");
const data = require("../data/config");
const fs = require("fs");
const serverAddress = "l0.101.110.181";
const mysql = require("mysql");
const config = {
    host: "localhost",
    user: "root",
    password: "Dragonslayer420",
    database: "api",
};

//create a pool with the database
const pool = mysql.createPool(config);

//do API routes
//this should redirect to /home
app.get('/', function (req, res) {
    res.redirect(301, "/home");
});

//webpages

//home page
app.get('/home', function (req, res) {
    res.sendFile("../../Website/home/home.html", { root: __dirname });
});

//login page
app.get('/login', function (req, res) {
    res.sendFile("../../Website/login/login.html", { root: __dirname });
});

//signup page
app.get('/signup', function (req, res) {
    res.sendFile("../../Website/signup/signup.html", { root: __dirname });
});


//requests

//new user user creation
app.post('/users', function (req, res) {
    //I have no idea if this works
    data.query("INSERT INTO users name email username password VALUES ? ? ?", req.name, req.email, req.username, function (error, result) {
        if (error) throw error;

        res.send(result);
    })
});

//get user info
app.get("/users/:id", function (res, req) {
    data.query("SELECT * FROM users WHERE id=?", res.params.id, function (error, result) {
        if (error) throw error;

        res.send(result);
    });
});
}

//use the body parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true,
}));

//link all of the website resources in the website folder
app.use("/static", express.static("../Website"));

//start the server
const server = app.listen(port, function (error) {
    if (error) return console.log("Error starting the server: " + error);

    console.log("Server listening on port " + port);
});