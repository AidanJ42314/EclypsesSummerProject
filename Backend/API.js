const exp = function (userin) {

    //dependencies --  "npm install express body-parser mysql fs path readline"
    const express = require('express');
    const port = 3001;
    const app = express();
    const body_parser = require("body-parser");
    const fs = require("fs");
    const serverAddress = "l0.101.110.181";
    const mysql = require("mysql");
    const path = require("path");
    const config = {
        host: "localhost",
        user: userin.user,
        password: userin.pass,
        database: "api",
    };

    //create a pool with the database
    const pool = mysql.createPool(config);

    //test to see if the database thing is working
    pool.query("INSERT INTO users (name, email) VALUES test, test@test.com");

    //do API routes
    //this should redirect to /home
    app.get('/', function (req, res) {
        res.redirect(301, "/home");
    });

    //webpages

    //home page
    app.get('/home', function (req, res) {
        res.sendFile(path.resolve("../Website/home.html"));
    });

    //login page
    app.get('/login', function (req, res) {
        res.sendFile(path.resolve("../Website/login.html"));
    });

    //signup page
    app.get('/signup', function (req, res) {
        res.sendFile(path.resolve("../Website/signup.html"));
    });

    //requests

    //new user user creation
    app.post('/users', function (req, res) {
        //I have no idea if this works
        mysql.query("INSERT INTO users name email username VALUES ? ? ?", req.name, req.email, req.username, function (error, result) {
            if (error) throw error;

            res.send(result);
        })
    });

    //get user info
    app.get("/users/:id", function (res, req) {
        pool.query("SELECT * FROM users WHERE id=?", res.params.id, function (error, result) {
            if (error) throw error;

            res.send(result);
        });
    });

    //use the body parser
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({
        extended: true,
    }));

    //link all of the website resources in the website folder
    app.use("", express.static("../Website"));

    //start the server
    const server = app.listen(port, function (error) {
        if (error) return console.log("Error starting the server: " + error);

        console.log("Server listening on port " + port);
    });

};

module.exports = exp;