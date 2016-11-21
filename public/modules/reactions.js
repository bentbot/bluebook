$(function() {
	// Reactions
	$('.reactions').on('click', function (e) {
		e.preventDefault();
		var id = $(this).attr('id');
		socket.emit('react', { 
			author: 'Liam Hogan', 
			conversation: id, 
			action: 'love' 
		})
	});
});