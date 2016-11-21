$(function() {
	// New Post
	$('.new-post').on('keyup', function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			var body = $(this).val();
			socket.emit('post', { body: body });
			$(this).val('');
		}
	});
});
