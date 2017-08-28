var express = require('express');
var passport   = require('passport');
var session    = require('express-session')({secret: 'todotopsecret',resave: true, saveUninitialized:true}); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var app = express();
var db = require('./models/index');
var List = require('./models/list')(db.Sequelize,db.sequelize);
var User = require('./models/user')(db.Sequelize,db.sequelize);
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sharedsession = require("express-socket.io-session");

User.hasMany(List, {foreignKey: 'user_id', sourceKey: 'id'});
List.belongsTo(User, {foreignKey: 'user_id', sourceKey: 'id'});

//For BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Using sessions, passport*/
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
io.use(sharedsession(session, {
    autoSave:true
}));

//load passport strategies
require('./passport/passport.js')(passport,User);
//load logic
require('./logic/index.js')(app,passport,List);

io.on('connection', function(socket){
	if(socket.handshake.session.passport && socket.handshake.session.passport.user) {
		var userID = socket.handshake.session.passport.user;
		User.findById(userID).then(function(user) {
			var username = user.firstname;

		  socket.on('chat message', function(msg){
		  	if(msg.trim().length > 0) {
			    io.emit('chat message', {msg: msg, username: username});
		  	}
		  });
		});
	}

});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

// app.listen(8080);
