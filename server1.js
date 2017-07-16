//Modules
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database.js');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

require('./config/passport')(passport);     // pass passport for configuration

//Constants
const PORT = 3000;

//DataBase
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("\nsuccessful connection to database\n");
});

//Configurations
var server = express();
server.set('view engine', 'ejs');
server.use('/', express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({extended: false}));
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({
    secret: 'fullstack',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}));
server.use(passport.initialize());
server.use(flash());

//Routes
var routing = require('./routes/frontoffice')(express.Router(), passport);
server.use('/', routing);

server.listen(PORT, function () {
    console.log('\n *** Server 1 ***');
    console.log('\t Port : ' + PORT);
    console.log('---------------------------');
})