$(function() {
	$('.login-button').click(function(e) {
		e.preventDefault();
		
		var loginForm = $( ".login-form" ).serialize();

		var loginRequest = $.ajax({
			url: '/login',
			data: loginForm,
			method: 'post'
		}).done(function ( res ) {
			if (res.results.code == 200) {
				$('.login-button').removeClass('warning').addClass('success');
				Cookies.set('user', res.results.cookie, { expires: 7 });
				location.reload();
			} else {
				for (var i = res.errors.length - 1; i >= 0; i--) {
					var error = res.errors[i];
					$('.login-button').removeClass('success').addClass('warning');
					switch (error.code) {
						case 400:
						case 403:
							var field = $('.login-form input[name="'+error.field+'"]'),
							left = field.position().left + 12;
							field.addClass('error').focus();
							$('.floater').remove();
							$('.notifications').append('<div class="floater hidden">'+error.notif+'</div>');
							setTimeout( function() { $('.floater').removeClass('hidden').css('left', left); }, 200);
							setTimeout( function() { $('.floater').addClass('hidden'); }, 5000);
						break;
					}
				};
			}
		});
		
	});
});
