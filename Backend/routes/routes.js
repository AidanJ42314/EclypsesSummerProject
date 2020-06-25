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
}

//export the router
module.exports = router;


