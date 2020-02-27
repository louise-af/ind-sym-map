
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById, db) {
    const authenticateUser = async (email, password, done) => {
        //const user = getUserByEmail(email);
        //console.log("passport user ", user);

        db.get('SELECT * FROM users WHERE email = ?', email, function (err, row) {
            if (!row) { // wrong user
                return done(null, false, { message: 'No user with that email' })
            }
            try {
                if (bcrypt.compare(password, row.hashedPassword)) { // success
                    return done(null, row);
                }
                return done(null, false, { message: 'Incorrect password' }); // this message is never sent - fix
            } catch (error) {
                return done(error);
            }
        })
    }
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // field in ejs
    }, authenticateUser)); // password: default password
    passport.serializeUser((user, done) => { console.log('Serialize id', user.id); done(null, user.id) }); // save to session
    passport.deserializeUser((id, done) => {
        console.log('Deserialize id ', id)
        console.log('get user ', getUserById(id))

        return done(null, getUserById(id))
    });
}

module.exports = initialize;