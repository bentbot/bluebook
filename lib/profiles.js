var Profile = function () {};
var models, reactions, feed;

Profile.prototype.the = function (models, feeds) {
	model = models;
	feed = feeds;
}

Profile.prototype.init = function (vars, req, callback) {
	vars.user = null;
	if (req.cookies.user) {
		vars.user = atob(req.cookies.user);
		Profile.prototype.user(vars.user, function (err, profile) {
			if (profile) vars.profile = profile;
			if (!profile.picture) profile.picture = 'user.png'
			callback(err, vars);
		});
	} else {
		callback(null, vars);
	}
}

Profile.prototype.login = function (email, password, callback) {
	model.Profiles.findOne({ email: email }, function (err, profile) {
		var error, result, cookie;
		if ( err || profile == null ) {
			error = {
				code: 400,
				field: 'email',
				notif: 'This account does not exist'
			};
			callback(error);
		} else if (profile) {
			profile.comparePassword(password, function (err, isMatch) {
				if ( isMatch === true ) {

					cookie = btoa(profile._id);

					result = {
						code: 200,
						cookie: cookie,
						profile: profile,
						notif: 'Login successful!'
					};
				} else {
					error = {
						code: 403,
						field: 'password',
						notif: 'The password entered is incorrect'
					};
				}
				callback(error, result);
			});
		}
	});
}

Profile.prototype.user = function (id, callback) {
	model.Profiles.findOne({ _id: id }, function (err, profile) {
		if (err) {
			error = {
				code: 400,
				field: 'cookie',
				notif: 'This account does not exist'
			};
			callback(error);
		} else if (profile) {
			var result;
			if (profile) result = profile;
			callback(err, result);
		}
	});
}



Profile.prototype.create = function (request, callback) {
	if (request) {
		request.alias = request.firstname + ' ' + request.lastname;
		request.codename = request.firstname.toLowerCase() + '.' + request.lastname.toLowerCase();
		request.picture = 'user.jpg';
		Profile.prototype.getCodename(request, function (err, codename) {
			console.log(codename)
			var newUser = new model.Profiles(request);
			newUser.save(function (err, responce) {
				if ( responce && !err ) {
					responce.cookie = btoa(responce._id);
				}
				callback(err, responce);
			});
		});
	} else {
		callback({ code: 422, notif: 'Invlid entry'})
	}
	
}


Profile.prototype.view = function (codename, vars, callback) {
	if (!callback) callback = vars;
	model.Profiles.findOne({ codename: codename }, function (err, profile) {
		if ( err || !profile ) {
			var error = {
				code: 404,
				notif: 'Profile not found'
			}
			callback(error);
			return false;
		} else if ( profile ) {
			feed.user(profile._id, 10, 0, function (err, feed) {
				if (err) {
					var error = {
						code: 404,
						notif: 'No posts found'
					}
				}
					var view = {
						profile: profile,
						posts: feed
					};
					callback( err, view );


			});
			
		}
	});
}

Profile.prototype.getCodename = function (request, callback) {
	if (request) {
		model.Profiles.count({ codename: request.codename }, function (err, count) {
			if (err) throw (err);
			if (count > 0) {
				count*100;
				var append = Math.random() * (0-count);
				request.codename = request.firstname.toLowerCase() + '.' + request.lastname.toLowerCase() + append;	
				Profile.prototype.getCodename(request);
			} else {
				callback(err, request.codename);
			}
		});	
	} else {
		callback({ code: 422, notif: 'Invalid codename request' })
	}
	
}

module.exports = new Profile();