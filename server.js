const express = require('express');
const app = express(); // rest requests
const bcrypt= require('bcrypt');

app.use(express.json()) // allows application to accept json
const users = []; // replace with DB

app.get('/users', (req, res) => {
    res.json(users)
});

// request and respons
app.post('/users', async (req, res) => { // bcrypt is an asynchronous library
    try {
        // const salt = await bcrypt.genSalt(); // default 10
        // console.log('salt: ', salt)
        // const hashedPassword = await bcrypt.hash(req.body.password, salt); // await async
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // equivalent to doing salt seperately
        console.log('hashedPassword: ', hashedPassword)
        // hashed password will contain the salt and the hash

        const user = { 
            name: req.body.name,
            password: hashedPassword
        };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});


app.post('/users/login', async (req, res) => {
    const givenName = req.body.name;
    const givenPassword = req.body.password;
    const user = users.find(user => user.name == givenName)

    console.log('USER: ', user)
    if (!user) {
        res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(givenPassword, user.password)) { // prevents timing attacks
            console.log('-------')
            res.send('Success'); // default status 200
        } else {
            res.send('Incorrect user or password');
        }
    } catch {
        res.status(500).send()
    }
})


app.listen(3000);