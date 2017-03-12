var Search = function () {};
var model, profile;

Search.prototype.the = function (models, profiles) {
	model = models;
	profile = profiles;
}

Search.prototype.globalSearch = function (query, callback) {
	var searchLimit = 5;
	model.Profiles.find({ 
			"firstname": {'$regex': query }
		}, { "password": 0 })
		.limit(searchLimit)
		.exec( function (err, responce) {
			if (err) throw (err);
			callback(err, responce);
		});
}

module.exports = new Search();