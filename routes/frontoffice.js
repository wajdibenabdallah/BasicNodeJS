module.exports = function (router, passport) {

    router.get('/', function (req, res) {
        var message = getMessage(req.sessionStore.sessions);
        //var message = req.flash('message'); express 3.0
        res.render('index', {message: message});
    });

    router.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profil',     // redirect to the secure profile section
            failureRedirect: '/',           // redirect back to the signup page if there is an error
            failureFlash: true              // allow flash messages
        })
    );

    router.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/profil', // redirect to the secure profile section
        failureRedirect: '/',       // redirect back to the signup page if there is an error
        failureFlash: true          // allow flash messages
    }));

    router.get('/profil', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function getMessage(sessions) {
    try {
        if (sessions) {
            var sessionsTab = [];
            for (var key in sessions) {
                sessionsTab.push(sessions[key]);
            }
            var lastElement = sessionsTab[sessionsTab.length - 1];
            if (lastElement) {
                var content = JSON.parse(lastElement);
                //console.log("\nType => " + typeof content + "\n");
                var messages = content.flash.message;
                var message;
                for (var k in messages) {
                    message = messages[k];
                    //console.log(message);
                    //console.log("\nType => " + typeof message + "\n");
                    return message;
                }
            }
            else
                return "";
        }
        else {
            return "";
        }
    } catch (e) {
        return "";
    }
}
