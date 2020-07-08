//dependencies -- 'npm i jsonwebtoken dotenv'

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as String, (err: any, user: any) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next() // pass the execution off to whatever request the client intended
    })
  }
> require('crypto').randomBytes(64).toString('hex');

const dotenv = require('dotenv');

dotenv.config();
process.env.TOKEN_SECRET;

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
}

const token = await res.json();

localStorage.setItem('token', token);