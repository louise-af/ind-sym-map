// Login and registration server

// load env variables
if (process.env.NODE_ENV !== 'production') { // in dev
    require('dotenv').config(); // will set them in process.env
}

const express = require('express');
const app = express(); // rest requests
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [{
    id: '1575548121829',
    name: 'Louise',
    email: 'h@h',
    password: '$2b$10$pQNU6yWdqQazcjykk7z5O.sAvEPWSyceltm5yw.cHELouR2490tQK'}]; // replace with DB

app.set('view-engine', 'ejs')
//app.use(express.json()); // allows application to accept json
app.use(express.urlencoded({extended: false})); // so we can access form inputs specified ejs file as req.body.password for example (based on name field of <input>)
app.use(flash());
app.use(session({ // login session handling variables
    secret: process.env.SESSION_SECRET,
    resave: false, // if nothing has changed, resave?
    saveUninitialized: false // save empty value if lack of values?
}));
app.use(passport.initialize());
app.use(passport.session()); // will work with app.use(session...) above
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.use(function(req, res, next) { // global variable
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})

app.get('/', (req, res) => {
    res.render('index.ejs', {region: 'Malmö hamnområde'}); // passing along. Use this instead req.user.name
});

app.get('/my-page', checkAuthenticated, (req, res) => {
    res.render('my-page.ejs', {name: req.user.name});
    // passport session means req.user will be current authenticated user
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/my-page',
    failureRedirect: '/login',
    badRequestMessage: 'Missing credentials', //missing credentials
    failureFlash: true // informs user about failures
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
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

app.delete('/logout', checkAuthenticated, (req, res) => { // forms does not support delete => we need method-override
    req.logOut(); // passport
    res.redirect('/login');
})

app.get('/about', (req, res) => {
    res.render('about.ejs');
})

// remove later
app.get('/users', (req, res) => { // will display all users on localhost:3000/users in json
    res.json(users);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

/*app.post('/login', async (req, res) => {
    const user = users.find(user => req.body.email == user.email);

    if (user) {
        console.log("user exists");
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.send('Success');
                console.log('success')
            } else {
                res.send('Invalid password');
            }
        } catch {
            res.status(500).send();
        }
    } else {
        console.log("user not exists");
        res.send('Invalid user');
    }
});*/

// request and respons
/*app.post('/users', async (req, res) => { // bcrypt is an asynchronous library
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
*/

app.listen(3000);