// API Routes
const router = function (app) {
    app.get('/', function (req, res) {
        res.send({
            message: "API Test",
        });
    };
}

//export the router
module.exports = router;


