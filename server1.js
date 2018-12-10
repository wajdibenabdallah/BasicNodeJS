const express = require('express')
    , path = require('path')
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
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.engine('ejs', require('express-ejs-extend')); // add this line
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'fullstack',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
var routing = require('./routes/frontoffice')(passport);
app.use('/', routing);

require('./socketServer')(io);

http.listen(PORT, function () {
    console.log('\n *** Server 1 ***');
    console.log('\t Port : ' + PORT);
    console.log('---------------------------');
})