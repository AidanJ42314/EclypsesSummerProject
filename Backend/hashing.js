// all of this should be placed in start.js

var db = require('../models');
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/signup', function (req, res) {
    bcrypt.hash(req.body.passwordsignup, saltRounds, function (err, hash) {
        db.User.create({
            name: req.body.usernamesignup,
            email: req.body.emailsignup,
            password: hash
        }).then(
            function (data) {
            if (data) {
                res.redirect('/home');
            }
        });
    });
}); 


app.post('/users', function (req, res) {
     db.User.findOne({
          where: {
              email: req.body.email
                 }
     }).then(function (user) {
         if (!user) {
            res.redirect('/');
         } else {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result == true) {
            res.redirect('/home');
        } else {
         res.send('Incorrect password');
         res.redirect('/');
        }
      });
     }
  });
}); 