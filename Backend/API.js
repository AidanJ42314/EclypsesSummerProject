//dependencies -- we probably need to install these on the server, but i'm not sure
//if we do, the command is 'npm install express body-parser mysql request'
const express = require('express');
const routes = require('./routes/routes');
const port = 3001;
const app = express();
const body_parser = require("body-parser");

//do API routes in the routes file
routes(app);

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