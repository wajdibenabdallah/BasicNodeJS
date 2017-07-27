var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function (passport) {
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        User.find({'local.username': user.local.username}, function (err, user) {
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
                    var Message = {
                        page: 'register',
                        message: null
                    }
                    // if there are any errors, return the error
                    if (err) {
                        return done(err);
                    }
                    // check to see if theres already a user with that email
                    if (user) {
                        Message.message = 'That username is already taken.';
                        return done(null, false, req.flash('message', Message));
                    } else {
                        var data = {
                            username: username,
                            email: req.body.emailr,
                            pass1: password,
                            pass2: req.body.confirmpassword
                        }

                        var testForm = validateData(data);
                        if (testForm !== true) {
                            Message.message = testForm;
                            return done(null, false, req.flash('message', Message));
                        }

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
        function (req, username, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.username': username}, function (err, user) {
                var Message = {
                    page: 'login',
                    message: null
                }
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user) {
                    Message.message = 'No user found.';
                    return done(null, false, req.flash('message', Message));
                }
                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    Message.message = 'Wrong password.';
                    return done(null, false, req.flash('message', Message));
                }
                // all is well, return successful user
                return done(null, user);
            });

        }));
};

function validateData(data) {

    //Rule 1 : username length > 5
    if (data.username.length < 6)
        return 'Username invalid : At least 6 characters';
    //Rule 2 : password length > 5
    else if (data.pass1.length < 6)
        return 'Password invalid : At least 6 characters'
    //Rule 2 : password length > 5
    else if (data.pass2 != data.pass1)
        return 'Passwords invalid : passwords do not match';
    else
        return true;
}