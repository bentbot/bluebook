var Friendship = function () {};
var models, profiles;

Friendship.prototype.the = function (model, profile) {
	models = model;
	profiles = profile;
}

Friendship.prototype.add = function (user, friend) {
	var friendship = new model.friends({
		east: user,
		west: friend,
		status: 'request'
	});
	friendship.save(function (err, friendship) {
		if (err) throw (err);

	});
}

Friendship.prototype.check = function (user, friend) {
	model.friends.findOne({ east: user, west: friend }, function (err, friendship) {
		if (err) throw (err);
		callback(err, friendship);
	});
}

module.exports = new Friendship();