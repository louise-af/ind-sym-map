// user login handler

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect password' });
            
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy({ userNameField: 'email' }, authenticateUser)); // password: default password
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((id, done) => {});
}

module.exports = initialize;