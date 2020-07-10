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

    //function to make calls to the database
    function dbq(query, params, callback) {
        if (arguments.length == 3) {
            connection.query(query, params, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, res);
                }
            })
        } else if (arguments.length == 2) {
            dbq(query, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, res);
                }
            })
        }
        
    }

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
        res.sendFile(path.resolve("../Website/chat.html"));
    });

    //specific chat thread
    app.get('/chat/:threadid', function (req, res) {
        res.sendFile(path.resolve("../Website/thread.html"));
        req.session.thread = threadid;
    });

    //requests

    //new user creation
    app.post('/newuser', function (req, res) {
        console.log("New user is being created.")

        dbq("SELECT name FROM users WHERE name=?", [req.body.name], function (err, result) {
            console.log("Name check query results: " + result)
            if (err) throw err;
            if (result.length() == 0) {
                dbq("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [req.body.username, req.body.email, req.body.password], function (error, result) {
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

        dbq("SELECT contents, time_sent, senderid FROM messages WHERE threadid=? ORDER BY time_sent DESC LIMIT 100", [req.session.threadid], function (err, result) {
            if (err) throw err;
            res.json({ messages: result });
        })
    });

    //get threads
    app.get('/threads', function (req, res) {
        console.log("User" + req.session.userid + " has just attempted to get their threads")

        dbq("SELECT name, threadid FROM threads WHERE uid = ? ORDER BY last_used DESC LIMIT 100", [req.session.threadid], function (err, result) {
            if (err) throw err;
            res.json({ threads: result });
        })
    })

    //login to the website
    app.post('/login', function (req, res) {
        console.log("User with name" + req.body.username + " has just attempted to log in")

        dbq("SELECT password userid FROM users WHERE name=?", [req.body.username], function (err, result) {
            if (err) throw err;

            if (result[0].password == req.body.password) {;
                res.json({ sucecss: true });
                req.session.userid = result[0].userid;
                res.sendFile("../Website/thread.html"); 
            }
        });
    });


    //create a thread
    app.post('/chat/', function (req, res) {
        console.log("User " + req.session.userid + "has just tried to create a new thread")

        //this is useful later
        var threadid;

        //create the thread
        dbq("INSERT INTO threads (userid, created_time) VALUES (?, ?)", [req.session.userid, Date.now()], function (err, result) {
            if (error) throw error;

            //find the thread we just created, and put it in threadid
            dbq("SELECT threadid FROM threads WHERE userid=? ORDER BY created_time DESC LIMIT 1", [req.session.userid], function (err, result2) {
                if (error) throw error;

                var failed_users = [];

                //loop through and add all of the members to the thread
                var members = req.body.members;
                for (var i = 0; i < members.length; i++) {
                    dbq("SELECT userid FROM users WHERE name = ? LIMIT 1", [members[i]], function (err, result3) {
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
                            dbq("INSERT INTO utjoin (userid, threadid, name) VALUES (?, ?, ?)", [result3[0].userid, result2[0].threadid, cmsp(members.splice(i))], function (err, result2) {
                                if (err) {
                                    failed_users.push(members[i]);
                                }

                                //if we are done and there are no failures, send a sucess message, otherwise, send a response including all failed members
                                if (i === members.length() - 1) {
                                    if (failed_users.length() !== 0) {
                                        res.json({ success: false, failed_users: failed_users });
                                    } else {
                                        res.json({ success: true });
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
    app.post('chat/:threadid', function (req, res) {
        console.log("User " + req.session.userid + " has just tried to send a message with the contents: '" + req.body.contents + "'")

        dbq("INSERT INTO messages (threadid, contents, time_sent, senderid) VALUES (?, ?, ?, ?)", [req.session.threadid, req.body.contents, Date.now(), req.params.userid], function (err, result) {
            if (error) throw error;
            dbq("UPDATE threads SET last_used=? WHERE threadid=?", [Date.now(), req.session.threadid], function (err, result2) {
                if (err) throw err;
                console.log(result);
                res.send({ success: true });
            })
            
        });
    });

    //edit a message
    app.put('chat/:threadid', function (req, res) {
        console.log("User " + req.session.userid + " has just tried to edit a message so that it now reads " + req.body.contents)

        dbq("", [req.params.threadid, req.body.messageid, req.body.contents], function (err, result) {
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