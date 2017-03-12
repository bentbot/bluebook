var Friendship = function () {};
var model, profile;

Friendship.prototype.the = function (models, profiles) {
	model = models;
	profile = profiles;
}


Friendship.prototype.add = function (user, friend, callback) {
	
	// Create a friendship by placing our users together.
	var friendship = new model.Friends({
		chicken: user,
		egg: friend,
		status: 'request'
	});

	friendship.save(function (err, request) {
		if (err) throw (err);
		callback(err, request);
	});
}

Friendship.prototype.requests = function (user, callback) {
	
	var responce = {
		count: 0,
		list: [
			{ request: {}, friend: {} }
		]
	};

	model.Friends.find({ egg: user, status: 'request' }, function (err, requests) {
		if ( err ) throw ( err );
		
		responce.count = requests.length;
		responce.list = [];
		if (responce.count > 0) {
			requests.forEach( function(request) {
				profile.user(request.chicken, function ( err, friendInfo ) {
					if ( err ) throw ( err );

					responce.list.push({ request: request, friend: friendInfo });

					callback(err, responce);
				});
			});
		} else {
			callback(null, []);
		}
		
	});
}

Friendship.prototype.responce = function (user, friend, responce, callback) {
	// Lets update the friendship by flipping the user's egg and hatch the politcal chicken-friend.
	model.Friends.findOneAndUpdate({ egg: user, chicken: friend }, { status: responce }, function (err, document) {
		if (err) throw (err);
		callback(err, document);
	});
}

Friendship.prototype.check = function (user, friend, callback) {
	// Find a friendship by checking for relations made from either side of the equation.
	model.Friends.findOne({ chicken: user, egg: friend }, function (err, a) {
		if (err) throw (err);

		// If the result is found, assign it as our friendship.
		if (a) var friendship = a;
		
		// Repeat the process by flipping x and y
		model.Friends.findOne({ egg: user, chicken: friend }, function (err, b) {
			if (err) throw (err);

			if (b) var friendship = b;

			// Send the friendship details back to the main application with the callback.
			callback(err, friendship);
		});
	});
}

module.exports = new Friendship();