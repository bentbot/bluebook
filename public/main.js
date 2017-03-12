var socket = io.connect('http://localhost:8080');
var user;


$(function() {

	$("time").timeago();

	$('.notifications li').on('click', function (e) {
		//var url = $(this).find('a').attr('href');
		//if (url) window.location.href = url;
		$(this).children('.bubble').toggleClass('active')
	});


	$('.confirm-friend').on('click', function(e){ 
		var friend = $(this).data('id');
		socket.emit('friend-responce', { friend: friend, responce: 'friends' });
	});

	$('.ignore').on('click', function(e) { 
		var friend = $(this).data('id');
		socket.emit('friend-responce', { friend: friend, responce: 'ignored' });
	});

	// Update Feed
	socket.on('feed', function (data) {
		if (data) {
			if (data.action == 'prepend') $('.feed').prepend(data.model);
			if (data.action == 'append') $('.feed').append(data.model);
			$('.error').fadeOut();
		}
	});


});