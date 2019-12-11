
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        console.log("passport user ", user);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, user.hashedPassword)) {
                console.log("correct cred")
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect password' });
            
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy({ 
        usernameField: 'email', 
        passwordField: 'password' 
    }, authenticateUser)); // password: default password
    passport.serializeUser((user, done) => done(null, user.id)); // save to session
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize;