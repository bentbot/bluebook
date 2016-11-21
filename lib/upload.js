var Upload = function () {};
var models, profiles, formidable;

Upload.prototype.the = function (formidables, model, profile) {
	models = model;
	profiles = profile;
	formidable = formidables;
}

Upload.prototype.cover = function (req, cb) {

	var form = formidable.IncomingForm();
	var file;
	form.uploadDir = path.join(__dirname, '../uploads/covers' )
	form.on('file', function(field, result) {
		file = result;
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});
	form.on('error', function(err){ 
		cb(err)
	});
	form.on('end', function() {
		model.Profiles.findOneAndUpdate({ _id: req.cookies.user }, { cover: file }, { upsert: true }, function (err) {
			if (err) throw(err);
			cb(null, file);
		});		
	});
	form.parse(req);
}

module.exports = new Upload();