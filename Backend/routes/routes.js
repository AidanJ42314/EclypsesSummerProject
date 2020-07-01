const data = require("../data/config");
const fs = require("fs");
const serverAddress = "localhost";

//sends an html page to the user
var send_page = function (res, file) {
    console.log("Page " + file + " reqested");
    res.writeHead(200, { "Content-Type": "text/html" });
    var rs = fs.createReadStream("../Website/" + file);
    rs.pipe(res);
};

// API Routes
const router = function (app) {
    //this should redirect to /home
    app.get('/', function (req, res) {
        res.redirect(301, "http/" + serverAddress + "/home");
    });

    //webpages

    //home page
    app.get('/home', function (req, res) {
        send_page("home/home.html");
    });

    //login page
    app.get('/home', function (req, res) {
        send_page("login/login.html");
    });

    //signup page
    app.get('/signup', function (req, res) {
        send_page("signup/signup.html");
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
    app.get("/users/:id", function (res, req){
        data.query("SELECT * FROM users WHERE id=?", res.params.id, function (error, result) {
            if (error) throw error;

            res.send(result);
        });
    }
}

//export the router
module.exports = router;


