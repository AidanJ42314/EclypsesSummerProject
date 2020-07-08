//dependencies -- 'npm i jsonwebtoken dotenv crypto'

module.exports = {

    authenticateToken: function (req, res, next) {
        const jwt = require('jsonwebtoken');
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token
  
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET + "", function(err, user){
            console.log(err)
            if (err) return res.sendStatus(403)
            req.user = user
            next() // pass the execution off to whatever request the client intended
        })
    },

    something: function () { require('crypto').randomBytes(64).toString('hex'); },


    init: function() {
        require('dotenv');

        dotenv.config();
        process.env.TOKEN_SECRET;
        localStorage.setItem('token', token);
    },



    generateAccessToken: function (username) {
      return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
    },

    token: function () { await res.json(); }



};