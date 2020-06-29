// requires "npm i express bcrypt"
// requires "npm i --save-dev nodemon"
// we can probably cut some of this down

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(salt)
        console.log(hashedPassword)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.listen(24513)