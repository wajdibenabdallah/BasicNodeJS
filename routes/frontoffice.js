var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.get('/', function (req, res) {
        var reqFlash = req.flash('message');
        var response = reqFlash[0];
        var message, page;
        if (response) {
            page = response.page;
            message = response.message;
        } else {
            page = "";
            message = "";
        }
        res.render('index', {page: page, message: message});
    });

    router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profil',     // redirect to the secure profile section
            failureRedirect: '/',           // redirect back to the signup page if there is an error
            failureFlash: true              // allow flash messages
        })
    );

    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: 'profil',  // redirect to the secure profile section
        failureRedirect: '/',       // redirect back to the signup page if there is an error
        failureFlash: true          // allow flash messages
    }));

    router.get('/profil', isLoggedIn, function (req, res) {
        var currentUser = req.user[0].local;
        res.render('profile', {
            user: currentUser
        });
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}