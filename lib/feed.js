var Feed = function () {};
var models, reactions;

Feed.prototype.the = function (models, reactions, profiles) {
	model = models;
	reaction = reactions;
}

Feed.prototype.user = function (id, limit, page, callback) {
	if (!callback) callback = page;
	model.Posts.find({ author: id }).limit(limit).sort({date: -1}).exec( function (err, posts) {
		model.Profiles.findOne({ _id: id}).exec(function (err, user) {
			if (err) throw (err)
			if (posts.length > 0) {
				Feed.prototype.generate( posts, function (err, feed) {
					if (err) callback(err);
					var result = {
						feed: feed, 
						profile: user
					}
					callback(err, result)
				});
			} else {
				callback({code: 404, message: 'No posts found!'});
			}
		})
		
	});
}

Feed.prototype.add = function (socket, her, callback) {
	var author;
	// Get cookie from socket
	Feed.prototype.parseCookie(socket, function (err, author) {
		if (err) throw (err);
		var post = new model.Posts({ 
			author: author,
			body: her.body
		});
		post.save(function(err, article) {
			if (err) throw (err)
			Feed.prototype.generate( article, callback );
		});
	});

}

Feed.prototype.generate = function (articles, callback) {
	var feed = [], errors = [];
	// Each Post
	if ( !Array.isArray(articles) ) articles = [articles];
	async.each( articles, function (article, cb) {

		// Add Post Reactions
		model.Profiles.findOne({ _id: article.author }).exec( function (err, profile) {

			model.Comments.find({ conversation: article._id }).exec( function (err, comments) {
				if (err) errors.push(err);

				reaction.get(article._id, function (err, reactions) {
					if (err) errors.push(err);

					feed.push({
						id: article._id,
						author: {
							id: profile._id,
							codename: profile.codename,
							name: profile.alias,
							profile: profile.picture
						},
						body: article.body,
						meta: {
							date: article.date
						},
						comments: comments,
						reactions: reactions
					});

					cb();
				});

			});
			
		});
	}, function (err) {
		if (err) errors.push(err);
		if (errors.length <= 0) errors = null;
		callback(errors, feed);
	});
	return;
}

Feed.prototype.parseCookie = function (socket, callback) {
	var user;

	var c = socket.handshake.headers.cookie;
 	c = c.split('; ');
	for (var i = c.length - 1; i >= 0; i--) {
		c[i] = c[i].split('=');
		if (c[i][0] == 'user') user = atob(c[i][1]);
	};
	callback(null, user)
}

module.exports = new Feed();