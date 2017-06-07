var express = require('express');
var passport   = require('passport');
var session    = require('express-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var app = express();
var db = require('./models/index');
var List = require('./models/list')(db.Sequelize,db.sequelize);
var User = require('./models/user')(db.Sequelize,db.sequelize);

User.hasMany(List, {foreignKey: 'user_id', sourceKey: 'id'});
List.belongsTo(User, {foreignKey: 'user_id', sourceKey: 'id'});

//For BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Using sessions, passport*/
app.use(session({secret: 'todotopsecret',resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

//load passport strategies
require('./passport/passport.js')(passport,User);
//load logic
require('./logic/index.js')(app,passport,List);

app.listen(8080);
