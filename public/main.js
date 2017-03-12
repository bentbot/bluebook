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

	$('#search').on('keyup', function(e) {
		var query = $(this).val();
		socket.emit('search', query);
		socket.on('searchResponce', function(responce) {
			$('.searchResults').html('').show();
			for (var i = responce.length - 1; i >= 0; i--) {
				console.log(responce[i]);
				var html = "<li class='searchResult'>"+
						"<a class='name' href='/u/"+responce[i].codename+"'>"+
						"<div class='image'>"+
						"<img src='/images/profiles/"+responce[i].picture+"' />"+
						"</div>"+
						"<div class='name'> "+responce[i].firstname+" "+responce[i].lastname+"</div>"+
						"<div class='occupation'> "+responce[i].email+"</div>";
				$('.searchResults').append(html);
			};
		});
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