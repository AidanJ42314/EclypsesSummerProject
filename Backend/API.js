const exp = function (userin) {


    //dependencies --  "npm install express body-parser mysql fs path readline"
    const express = require('express');
    const port = 3001;
    const app = express();
    const expressSession = require('express-session')
    const body_parser = require("body-parser");
    const fs = require("fs");
    const serverAddress = "l0.101.110.181";
    const mysql = require("mysql");
    const path = require("path");

    //function to separate a list strings with commas
    var cmsp = function (values) {
        var end = "";
        for (var i = 0; i < values.length() - 1; i++) {
            end += values[i] + ", ";
        }
        end += values[values.length - 1];
    };

    //use the body parser
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({
        extended: true,
    }));

    //use express
    app.use(express.static(_dirname));
    app.use(expressSession);

    //create a connection to the database
    const connection = mysql.createConnection({
        host: "localhost",
        user: userin.user,
        password: userin.pass,
        database: "api",
    })
    connection.connect(function (err) {
        if (err) throw err;
        console.log("Database connected.");
    })

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

    //chat thread selection
    app.get('/chat/:userid/:threadid', function (req, res) {
        res.sendFile(path.resolve("../Website/chat.html"));
    });

    //specific chat thread
    app.get('/chat/:userid/:threadid', function (req, res) {
        res.sendFile(path.resolve("../Website/thread.html"));
    });

    //requests

    //new user user creation
    app.post('/newuser', function (req, res) {
        //I have no idea if this works
        console.log(req.body);
        connection.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [req.body.username, req.body.email, req.body.password], function (error, result) {
            if (error) throw error;
            console.log(result);
            res.sendFile(path.resolve("../Website/newuser.html"));
        })
    });

    //create a thread
    app.post('/chat/:userid', function (req, res) {
        //this is useful later
        var threadid;

        //create the thread
        connection.query("INSERT INTO threads (userid, created_time) VALUES (?, ?)", [req.params.userid, Date.now()], function (err, result) {
            if (error) throw error;

            //find the thread we just created, and put it in threadid
            connection.query("SELECT threadid FROM threads WHERE userid=? ORDER BY created_time DESC LIMIT 1", [req.params.userid], function (err, result2) {
                if (error) throw error;

                var failed_users = [];

                //loop through and add all of the members to the thread
                var members = req.body.members;
                for (var i = 0; i < members.length; i++) {
                    connection.query("SELECT userid FROM users WHERE name = ? LIMIT 1", [members[i]], function (err, result3) {
                        if (err) {
                            failed_users.push(members[i]);

                            //if we are done and there are no failures, send a sucess message, otherwise, send a response including all failed members
                            if (i === members.length() - 1) {
                                if (failed_users.length() !== 0) {
                                    res.send({ success: false, failed_users: failed_users });
                                } else {
                                    res.send({ success: true });
                                }
                            }
                        } else {
                            connection.query("INSERT INTO utjoin (userid, threadid, name) VALUES (?, ?, ?)", [result3[0].userid, result2[0].threadid, cmsp(members.splice(i))], function (err, result2) {
                                if (err) {
                                    failed_users.push(members[i]);
                                }

                                //if we are done and there are no failures, send a sucess message, otherwise, send a response including all failed members
                                if (i === members.length() - 1) {
                                    if (failed_users.length() !== 0) {
                                        res.send({ success: false, failed_users: failed_users });
                                    } else {
                                        res.send({ success: true });
                                    }
                                }
                            });
                        }
                    });
                }
            });

            
        })
    })

    //send a message
    app.post('chat/:userid/:threadid', function (req, res) {
        connection.query("INSERT INTO messages (threadid, contents, time_sent, senderid) VALUES (?, ?, ?, ?)", [req.params.threadid, req.body.contents, Date.now(), req.params.userid], function (err, result) {
            if (error) throw error;
            console.log(result);
            res.send({ success: true });
        });
    });

    //edit a message
    app.put('chat/:userid/:threadid', function (req, res) {
        connection.query("", [req.params.threadid, req.body.messageid, req.body.contents], function (err, result) {
            if (error) throw error;
            console.log(result);
            res.send({ success: true });
        });
    });

    //get user info
    app.get("/users/:userid", function (res, req) {
        connection.query("SELECT * FROM users WHERE id=?", [req.params.userid], function (error, result) {
            if (error) throw error;
            console.log(result);
            res.send(result);
        });
    });

    //link all of the website resources in the website folder
    app.use("", express.static("../Website"));

    //start the server
    const server = app.listen(port, function (error) {
        if (error) return console.log("Error starting the server: " + error);

        console.log("Server listening on port " + port);
    });

};

module.exports = exp;