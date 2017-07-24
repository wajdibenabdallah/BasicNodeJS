var express = require('express')
    , path = require('path')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , session = require('express-session')
    , flash = require('connect-flash')
    , mongoose = require('mongoose')
    , logger = require('morgan');

// pass passport for configuration
require('./config/passport')(passport);

//Constants
const PORT = 3000;

//DataBase
var configDB = require('./config/database');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("\nsuccessful connection to database\n");
});

//Configurations
var server = express(server);
server.set('view engine', 'ejs');
server.engine('ejs', require('express-ejs-extend')); // add this line
server.use('/', express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({extended: false}));
//server.use(logger('dev'));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({
    secret: 'fullstack',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}));

server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

//Routes
var routing = require('./routes/frontoffice')(passport);
server.use('/', routing);

server.listen(PORT, function () {
    console.log('\n *** Server 1 ***');
    console.log('\t Port : ' + PORT);
    console.log('---------------------------');
})