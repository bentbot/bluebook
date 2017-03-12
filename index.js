// Requirements
var package = require(__dirname+'/package.json'),
	bodyparser = require('body-parser'),
	cafe = require('coffee-middleware'),
	cookies = require('cookie-parser'),
	formidable = require('formidable'),
	coffee = require('coffee-script')
	bcryptjs = require('bcryptjs'),
	mongoose = require('mongoose'),
	socket = require('socket.io'),
	express = require('express'),
	winston = require('winston'),
	cookie = require('cookie'),
	stylus = require('stylus'),
	async = require('async'),
	mocha = require('mocha'),
	path = require('path'),
	atob = require('atob'),
	btoa = require('btoa'),
	http = require('http'),
	jade = require('jade'),
	nib = require('nib'),
	fs = require('fs');

// Application
var app = express(),
	server = http.Server(app),
	io = socket(server);

// Middleware
var feed = require('./lib/feed'),
	models = require('./lib/model'),
	friendships = require('./lib/friends'),
	reaction = require('./lib/reactions'),
	search = require('./lib/search'),
	profile = require('./lib/profiles'),
	upload = require('./lib/upload');

var vars = {
	name: 'Bb',
	title: 'Bluebook',
	app: package,
	port: 8080
}

// MongoDB
mongoose.connect('mongodb://book:book@192.168.0.101:27017/book');

// Setup middlewares
feed.the(models, reaction); 
friendships.the(models, profile);
profile.the(models, feed, friendships);
search.the(models, profile);
reaction.the(models);
upload.the(formidable, models, profile);

// Express.js
var views 	= path.join( __dirname, '/views'),
	public 	= path.join( __dirname, '/public'),
	styles	= path.join( __dirname, '/public/stylus');
	uploads = path.join( __dirname, '/uploads');

	app.set('view engine', 'jade');
	app.set('views', views);
	app.use(stylus.middleware({
		src: public, 
		compile: function (str, path) {
			return stylus(str)
			.set('filename', path)
			.set('compress', false)
			.use(nib());
		}
	}));

	app.use(cafe({
		src: public, 
		compress: true
	}));

	app.use(cookies())
	app.use(express.static(public))
	app.use(bodyparser.json())
	app.use(bodyparser.urlencoded({
		extended: true
	})); 


/**
* Front Page
**/

app.get('/', function(req, res) {
	profile.init(vars, req, function (err, data) {
		if (err) {
			res.clearCookie('user');
			res.render('welcome', vars);
			console.log(vars.users);
		} else if (data.user) { 
			vars = data;
			// Get the first ten posts for a user
			feed.user(data.user, 10, 0, function (err, posts) {
				if (err) vars.error = err;
				data.posts = posts;
				res.render('index', data);
			});
		}
	});
});

app.get('/react', function(req, res) {
	profile.init(vars, req, function (err, data) {
		if (err) {
			res.clearCookie('user');
			res.send('welcome', vars);
		} else if (data.user) { 
			vars = data;
			// Get the first ten posts for a user
			feed.user(data.user, 10, 0, function (err, posts) {
				if (err) vars.error = err;
				data.posts = posts;
				res.render('react', data);
			});
		}
	});
});




/**
* Profile Page
**/

app.get('/u/:codename', function (req, res) {
	profile.init(vars, req, function (err, data) {
		vars = data;
		profile.view(req.params.codename, data, function (err, view) {
			if (err) data.error = err;
			if (view) data.view = view.profile;
			res.render('profile', data);
		});
	});
});

	app.post('/u/cover', function (req, res) {
		profile.init(vars, req, function (err, data) {
			vars = data;
			upload.cover( req, function (err, file) {
				if (err) res.send(err)
				res.send(file.name)
			});
		});
	});

/**
 * Image Handling
**/

app.get('/images/:type/:img', function (req, res) {
	fs.readFile( path.join(__dirname, '/uploads/'+req.params.type+'/'+req.params.img), function ( err, data ) {
		if (data) {
			res.writeHead(200, {'Content-Type': 'image/jpg'});
			res.end(data, 'binary');
		} else {
			res.send('Nothing found. xD');
		}
	});
})


/**
* Login 
**/

app.get('/login', function(req, res) {
	res.render('welcome', vars);
});

app.post('/login', function(req, res) {
	var loginError = new Array(),
		loginResult = new Array();
		password = req.body.password,
		email = req.body.email;

	if ( password && email ) {

		profile.login( email, password, function (err, result) {
			var login = { errors: [], results: [] };
			if ( result ) login.results = result;
			if ( err ) login.errors.push(err);
			
			res.cookie('user', login.results.cookie);
			res.send(login);
		});

	} else {

		if (!email) {
			loginError.push({
				code:  400,
				error: 'login failure',
				field: 'email',
				notif: 'Email Required'
			});
		} if (!password) {
			loginError.push({
				code:  400,
				error: 'login failure',
				field: 'password',
				notif: 'Password Required'
			});
		}

		var login = { errors: [], results: [] };
		if ( loginError.length > 0 ) login.errors = loginError;
		res.send(login);
	}

});

/**
 * Search API
**/
app.post('/search', function(req, res) {
	res.send(req.body.q);	
});


// The user should be able to logout
app.get('/logout', function(req, res) {
	res.clearCookie('user');
	res.redirect('/');
});


// API Requests
app.get('/api', function(req, res) {
	res.redirect('/');
});
app.post('/api/signup', function(req, res) {
	profile.create(req.body, function(err, user) {
		if (err) res.send(err);
		if (user) user.password = null;
		res.send(user);
	});
});

// Socket.io
io.on('connection', function (socket) {

	socket.on('signup', function (signup) {
		
		profile.create(signup, function (err, result) {
			
			var user = { err: [], data: [] };
			if ( result ) user.data = result;
			if ( err ) user.err.push(err);
			
			socket.emit('signup', user);
		});
			
	});

	socket.on('search', function (query) {
		search.globalSearch(query, function(err, responce) {
			socket.emit('searchResponce', responce);	
		});
	});

	socket.on('post', function (post) {
		feed.add(socket, post, function (err, results) {
			if (err) throw (err);
			emitPost(socket, results, 'prepend')
		});
	});

	socket.on('addfriend', function (friend) {
		friendships.add(vars.user, friend, function (err, request) {
			if (err) throw (err);
			console.log( friend, request );
		});
	});

	socket.on('react', function (reaction) {
		reaction.add(socket, reaction, function (err, result) {
			if (err) throw (err);
			reaction.count( result );
			emitReaction(socket, result);
		});
	});

	socket.on('friend-responce', function (data) {
		console.log(vars.user, data);
		friendships.responce(vars.user, data.friend, data.responce, function(err, result) {
			if (err) throw (err);
			socket.emit('friend-responce', result);
		});
	});


});

function emitPost(socket, posts, action) {
	// Generate a feed array with this post
	if (!action) var action = 'prepend';
	var opts = {posts: []};
	posts.forEach( function(post) {
		opts.posts.push(post);	
	});
	var model = jade.renderFile(views+'/articles.jade', opts);
	socket.emit('feed', { action: action, model: model });
}

server.listen(vars.port);
