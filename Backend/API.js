const exp = function (userin) {


    //dependencies --  "npm install express body-parser mysql fs path readline jsonwebtoken dotenv bcrypt express-session"
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
        for (var i = 0; i < values.length - 1; i++) {
            end += values[i] + ", ";
        }
        end += values[values.length - 1];
        return end;
    };

    //use the body parser
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({
        extended: true,
    }));
    
    //use express
    app.use(express.static(__dirname));
    var secret = require('crypto').randomBytes(64).toString('hex');
    app.use(expressSession({
        secret: secret
    }));

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
    app.get('/chat', function (req, res) {
        res.sendFile(path.resolve("../Website/thread.html"));
    });

    //specific chat thread
    app.get('/chat/:threadid', function (req, res) {
        res.sendFile(path.resolve("../Website/chat.html"));
        req.session.threadid = req.params.threadid;
    });

    //requests

    //new user creation
    app.post('/newuser', function (req, res) {
        console.log("New user is being created.")

        connection.query("SELECT userid FROM users WHERE userid=?", [req.body.username], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length == 0) {
                connection.query("INSERT INTO users (userid, email, password) VALUES (?, ?, ?)", [req.body.username, req.body.email, req.body.password], function (error, result) {
                    if (error) throw error;
                    console.log(result);
                    res.sendFile(path.resolve("../Website/newuser.html"));
                })
            } else {
                res.json({message: "name taken"})
            }
        })
        
    });

    //get messages
    app.get('/messages', function (req, res) {
        console.log("User " + req.session.userid + " has just attempted to get messages from " + req.session.threadid);

        connection.query("SELECT contents, time_sent, senderid FROM messages WHERE threadid=? ORDER BY time_sent DESC LIMIT 100", [req.session.threadid], function (err, result) {
            if (err) throw err;
            res.json({ messages: result });
        })
    });

    //get threads
    app.get('/threads', function (req, res) {
        console.log("User " + req.session.userid + " has just attempted to get their threads")

        connection.query("SELECT b.threadid, a.name FROM utjoin a, threads b WHERE a.userid=? ORDER BY b.last_used DESC LIMIT 100", [req.session.userid], function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json({ threads: result });
        })
    })

    //login to the website
    app.post('/login', function (req, res) {
        console.log("User with name " + req.body.username + " has just attempted to log in")

        connection.query("SELECT * FROM users WHERE userid=?", [req.body.username], function (err, result) {
            console.log("Query returns: ")
            console.log(result)
            //yay
            if (err) throw err;

            if (result[0].password == req.body.password) {
                req.session.userid = result[0].userid;
                res.redirect("../chat"); 
            }
        });
    });

    //create a thread
    app.post('/threads/', function (req, res) {
        console.log("User " + req.session.userid + " has just tried to create a new thread with users " + req.body.members + " and body " + req.body)

        //create the thread
        connection.query("INSERT INTO threads (userid, created_time, last_used) VALUES (?, ?, ?)", [req.session.userid, Date.now(), Date.now()], function (err, result) {
            if (err) throw err;

            console.log("creating thread")

            //find the thread we just created, and put it in threadid
            connection.query("SELECT threadid FROM threads WHERE userid=? ORDER BY created_time DESC LIMIT 1", [req.session.userid], function (err, result2) {
                if (err) throw err;

                console.log("thread with id " + result2[0].threadid + " created")

                //loop through and add all of the members to the thread
                var members = req.body.members;

                //use recursion to do this properly maybe?
                var addutjoin = function (err, result3, solution = false) {
                    if (!solution) {
                        if (err) throw err;

                        console.log("message thing from userid " + members[members.length-1] + ": " + result3)

                        //if we are done and there are no failures, send a sucess message, otherwise, send a response including all failed members -- NOT
                        if (members.length == 0) {
                            res.redirect("/" + result2[0].threadid)
                        } else {
                            connection.query("INSERT INTO utjoin (userid, threadid, name) VALUES (?, ?, ?)", [members.pop(), result2[0].threadid, cmsp(members.splice(i))], addutjoin);
                        }
                    } else {
                        connection.query("INSERT INTO utjoin (userid, threadid, name) VALUES (?, ?, ?)", [req.session.userid, result2[0].threadid, cmsp(members.splice(i))], addutjoin);
                    }
                }

                //start that recursion
                addutjoin(null, null, true);
            });
        })
    })

    //send a message
    app.post('chat/:threadid', function (req, res) {
        console.log("User " + req.session.userid + " has just tried to send a message with the contents: '" + req.body.contents + "'")

        connection.query("INSERT INTO messages (threadid, contents, time_sent, senderid) VALUES (?, ?, ?, ?)", [req.session.threadid, req.body.contents, Date.now(), req.params.userid], function (err, result) {
            if (error) throw error;
            connection.query("UPDATE threads SET last_used=? WHERE threadid=?", [Date.now(), req.session.threadid], function (err, result2) {
                if (err) throw err;
                console.log(result);
                res.send({ success: true });
            })
            
        });
    });

    //edit a message
    app.put('chat/:threadid', function (req, res) {
        console.log("User " + req.session.userid + " has just tried to edit a message so that it now reads " + req.body.contents)

        connection.query("", [req.params.threadid, req.body.messageid, req.body.contents], function (err, result) {
            if (error) throw error;
            console.log(result);
            res.send({ success: true });
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