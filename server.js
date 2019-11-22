// Login and registration server
const express = require('express');
const app = express(); // rest requests
const bcrypt= require('bcrypt');

app.use(express.json()) // allows application to accept json
app.use(express.urlencoded({extended: false})) // so we can access form inputs specified ejs file as req.body.password for example (based on name field of <input>)

const users = []; // replace with DB

// questions and thoughts
// what is res and why does it have functions
// read about express and ejs
// chose database type
app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs', {name: 'Louise'}); // assing along
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const user = users.find(user => req.body.email == user.email);

    if (user) {
        console.log("user exists");
        try {
            if (true) {//await bcrypt.compare(req.body.password, user.password)) {
                res.send('Success');
            } else {
                res.send('Invalid password');
            }
        } catch {
            res.status(500).send();
        }
    } else {
        console.log("user not exists")
        res.send('Invalid user');
    }
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('hashedPassword: ', hashedPassword);

        const user = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };
        users.push(user); // add to DB

        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log("users: ", users)
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
})

app.get('/users', (req, res) => { // will display all users on localhost:3000/users in json
    res.json(users);
});

// request and respons
app.post('/users', async (req, res) => { // bcrypt is an asynchronous library
    try {
        // const salt = await bcrypt.genSalt(); // default 10
        // console.log('salt: ', salt)
        // const hashedPassword = await bcrypt.hash(req.body.password, salt); // await async
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // equivalent to doing salt seperately
        console.log('hashedPassword: ', hashedPassword);
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
    const user = users.find(user => user.name == givenName);

    console.log('USER: ', user)
    if (!user) {
        res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(givenPassword, user.password)) { // prevents timing attacks
            console.log('-------');
            res.send('Success'); // default status 200
        } else {
            res.send('Incorrect user or password');
        }
    } catch {
        res.status(500).send();
    }
})


app.listen(3000);