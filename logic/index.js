module.exports = function(app, passport, List) {
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/signin');
	}
	function isNotLoggedIn(req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/todo');
	}

	/* The to do list and the form are displayed */
	app.get('/todo', isLoggedIn, function(req, res) {
		if(req.user.id){
			List.findAll({attributes: ['id', 'info'], raw: true, where: {user_id: req.user.id}}).then(function(lists) {
				res.render('todo.ejs', {todolist: lists});
			});
		}
	});

	app.post('/todo/add/', function(req, res) {
		if (req.body.newtodo != '' && req.user.id) {
			List.create({
				user_id: req.user.id,
				info: req.body.newtodo
			}).then(function(lists) {
				res.send({id:lists.id, info: lists.info});
			});
		}
	});

	/* Deletes an item from the to do list */
	app.post('/todo/delete/', function(req, res) {
		if (req.body.id != '' && req.user.id) {
			List.destroy({
			where: {
				id: req.body.id,
				user_id: req.user.id
			}
			}).then(function() {
				res.sendStatus(200);
			});
		}
	});

	app.get('/', function(req, res){
		res.redirect('/signin');
	});

	app.get('/signup',  isNotLoggedIn, function(req, res){
		res.render('signup.ejs');
	});

	app.post('/signup', passport.authenticate('local-signup', {successRedirect: '/todo', failureRedirect: '/signup'}));

	app.get('/signin',  isNotLoggedIn, function(req, res){
		res.render('signin.ejs');
	});

	app.post('/signin', passport.authenticate('local-signin', { successRedirect: '/todo', failureRedirect: '/signin'}));

	app.get('/logout',  function(req, res){
		req.session.destroy(function(err) {
			res.redirect('/signin');
		});
	});
};