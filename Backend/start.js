const API = require("API.js");

//set up prompt for getting all nessecary user info
const prompt = require("prompt");

var userin = {};

//get someone to enter in a username and password for the database (for security)
prompt.start();
prompt.get(['database_user', 'database_pass'], function (err, res) {
    if (err) return err;
    userin.user = res.database_user;
    userin.pass = re.database_pass;

    //after those have been added, pass it to the API file
    API(userin);
});