$(function() {

	$('.notifications li .bubble-menu').click(function (e) {
		document.location.href = $(this).find('a').attr('href');
	});

	$('.settings').click(function (e) {
		$(this).find('.bubble-menu').toggleClass('active');
	});

	$('main').click(function (e) {
		$('.bubble-menu').removeClass('active');
	});

});