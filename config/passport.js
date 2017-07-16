var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function (passport) {
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'usernamer',
            passwordField: 'passwordr',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            try {
                User.findOne({'local.username': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        console.dir(err);
                        return done(err);
                    }
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('message', 'That username is already taken.'));
                    } else {
                        var data = {
                            username: username,
                            email: req.body.emailr,
                            pass1: password,
                            pass2: req.body.confirmpassword
                        }
                        console.dir(data);
                        validateData(data, done);

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.local.username = username;
                        newUser.local.email = req.body.emailr;
                        newUser.local.password = newUser.generateHash(password);
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
            catch (exp) {
                console.dir(exp);
            }
        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'usernamel',
            passwordField: 'passwordl',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            console.log("local-login");
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.email': email}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                return done(null, user);
            });

        }));
};

function validateData(data, done) {

    //Rule 1 : username length > 5
    if (data.username.length < 6)
        return done(null, false, req.flash('message', 'Username invalid : At least 6 characters'));
    //Rule 2 : password length > 5
    if (data.pass1.length < 6)
        return done(null, false, req.flash('message', 'Password invalid : At least 6 characters'));
    //Rule 2 : password length > 5
    if (data.pass2 != data.pass1)
        return done(null, false, req.flash('message', 'Passwords invalid : passwords do not match'));
}