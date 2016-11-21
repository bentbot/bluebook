/**
 * GNU General Public License
 * Defining the Database
 *
 * Each entry is a schema containing a list of virables and which type of data supported.
 *
 * type: String 	defines a simple word or group of words saved in plan text. 
 * type: Date 		an automatically generated field with the default date of 'now'.
 * required: True 	will prevent partial data from being saved. 
 *
 * 	mongoose 		is our database engine. The actual connection is defined in index.js
 *  Schema 			a prototype function which translates JSON structure into a DB model
 * 	model 			a template designed as a single entry or post in the database
 *  bcrypt 			password masking and comparison library for security
 *  module.exports  sends all the schemas to the application core
**/

var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs');

var Friends = new mongoose.Schema({
	east: { type: String, required: true }, 
	west: { type: String, required: true }, 
	status: { type: String, required: true }, 
	date: { type: Date, default: Date.now } 
});

var Profiles = new mongoose.Schema({
	alias: { type: String, required: true }, 
	firstname: { type: String, required: true }, 
	lastname: { type: String, required: true }, 
	email: { type: String, required: true, unique: true }, 
	password: { type: String, required: true },
	codename: { type: String, required: true },
	picture:  { type: String, required: true },
	occupation: String, 
	cover: String,
	timezone: String,
	gender: String
});

var Posts = new mongoose.Schema({
	author: { type: String, required: true }, 
	body: { type: String, required: true }, 
	date: { type: Date, default: Date.now } 
});

var Comments = new mongoose.Schema({
	author: { type: String, required: true }, 
	body: { type: String, required: true }, 
	conversation: String, 
	date: { type: Date, default: Date.now } 
});

var Reactions = new mongoose.Schema({
	author: { type: String, required: true }, 
	reaction: { type: String, required: true }, 
	conversation: { type: String, required: true }, 
	date: { type: Date, default: Date.now } 
});

var Notifcations = new mongoose.Schema({
	profile: { type: String, required: true },
	type: { type: String, required: true },
	title: { type: String, required: true },
	body: String,
	icon: String,
	status: String,
	notify: { type: String, default: true },
	date: { type: Date, default: Date.now } 
})





/**
 * Profile Middleware
 * 
 * These functions handle the creation of user passwords, hashing them into a unique code. 
 * Comparing 'plan-text' passwords can only by done using the method below.
**/

// Creatre a Password
Profiles.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Compare a candidate password
Profiles.methods.comparePassword = function ( candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	})
}




/**
 * Export the database models to the aplication
**/

module.exports = {
	Profiles: mongoose.model('profiles', Profiles),
	Posts: mongoose.model('posts', Posts),
	Comments: mongoose.model('comments', Comments),
	Reactions: mongoose.model('reactions', Reactions)
}