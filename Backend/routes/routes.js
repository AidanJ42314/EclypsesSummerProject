const data = require("../data/config");

// API Routes
const router = function (app) {
    //replace these with the website pages

    //homepage
    app.get('/', function (req, res) {
        res.send({
            message: "server Test",
        });
    });

    //user page
    app.get('/home/', function (req, res) {
        res.send({ message: "/home/ test" });
    });

    //api database test area
    app.get('/test/', function (req, res) {
        data.query("SELECT * FROM test", function (error, result) {
            if (error) throw error;

            res.send(result);
        })
    });

    //new user user creation
    app.post('/users/', function (req, res) {
        //add in code here that makes a new user
    });
}

//export the router
module.exports = router;


