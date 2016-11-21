var Reaction = function () {};
var models;

var kinds = [
	{ type: 'like', title: 'Like', plural: 'Likes', icon: 'fa-thumbs-up' },
	{ type: 'love', title: 'Love', plural: 'Love', icon: 'fa-heart' },
	{ type: 'laugh', title: 'Laugh', plural: 'Laughs', icon: '' }
];

Reaction.prototype.the = function (models) {
	model = models;

}

Reaction.prototype.kinds = function (callback) {
	return kinds;
}

Reaction.prototype.add = function (socket, react, callback) {
	if (!react.convo) react.convo = null;
	var reaction = new model.Reactions({
		conversation: react.conversation,
		author: react.author,
		reaction: react.action
	})
	reaction.save(function (err, action) {
		callback(err, action);
	})
}

Reaction.prototype.get = function (id, callback) {
	var result = {};

	model.Reactions.find({ conversation: id }, function (err, reactions) {
		if (err) throw (err)
		result.kinds = kinds;
		result.emotes = reactions;
		callback(err, result);
	});
}

module.exports = new Reaction();