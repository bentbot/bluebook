var socket = io.connect('http://localhost:8000');
var user;


$(function() {

	$(".date").timeago();

	$('.notifications li').on('click', function (e) {
		//var url = $(this).find('a').attr('href');
		//if (url) window.location.href = url;
		$(this).children('.bubble').toggleClass('active')
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