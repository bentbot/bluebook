var Friendship = function () {};
var model, profile;

Friendship.prototype.the = function (models, profiles) {
	model = models;
	profile = profiles;
}


Friendship.prototype.add = function (user, friend, callback) {
	
	// Create a friendship by placing our users together.
	var friendship = new model.Friends({
		x: user,
		y: friend,
		status: 'request'
	});

	friendship.save(function (err, request) {
		if (err) throw (err);
		callback(err, request);
	});
}


Friendship.prototype.responce = function (user, friend, responce, callback) {
	// Lets update the friendship by flipping the y and y identifiers and saving the status.
	model.Friends.findOneAndUpdate({ y: user, x: friend }, { status: responce }, function (err, document) {
		if (err) throw (err);
		callback(err, document);
	});
}

Friendship.prototype.check = function (user, friend, callback) {
	// Find a friendship by checking for relations made from either side of the equation.
	model.Friends.findOne({ x: user, y: friend }, function (err, a) {
		if (err) throw (err);

		// If the result is found, assign it as our friendship.
		if (a) var friendship = a;
		
		// Repeat the process by flipping x and y
		model.Friends.findOne({ y: user, x: friend }, function (err, b) {
			if (err) throw (err);

			if (b) var friendship = b;

			// Send the friendship details back to the main application with the callback.
			callback(err, friendship);
		});
	});
}

module.exports = new Friendship();