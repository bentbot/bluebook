$(function() {
    $( ".signup form" ).click(function( event ) {

        event.preventDefault();

    });

	$( ".signup.button" ).click(function( event ) {

        event.stopPropagation();

		var data = $( ".signup form" ).serializeObject();


		socket.emit('signup', data );

		socket.on('signup', function(result) {

            console.log(result)

			// Reset form field error states
			$('.newusers input').on('keydown change', function (e){
				$(".signup form").removeClass('error');
			});

			// Check for field errors
			if (result || result.code == 11000) {

                var loginRequest = $.ajax({
                    url: '/login',
                    data: data,
                    method: 'post'
                }).done(function ( res ) {
                    if (res.results.code == 200) {
                        console.log(res);
                        Cookies.set('user', res.results.cookie, { expires: 7 });
                        $('.signup.button').val('Welcome').addClass('green').removeClass('red');
                        setTimeout( function(){ location.reload(); },500);
                    } else {
                        $('.signup.button').val('Duplicate Email Address').addClass('red').removeClass('green');
                        setTimeout(function() {
                            $('.signup.button').val('Signup').removeClass('red');
                        }, 2500);
                    }
                });

            // The sign up successful
            } else if (result.errmsg) {
               $('.signup.button').val('Signup Error').addClass('red').removeClass('green');
                setTimeout(function() {
                    $('.signup.button').val('Signup').removeClass('red');
                }, 2500); 
            } else if (result && result.profile && result.profile.errors) {
                
                // Clear old errors from the form inputs
                $('.newusers input').removeClass('error')

                // For each error, add a red outline with the error class
                $.each(result.profile.errors, function( err ) {
                    $('.newusers input[name="'+err+'"]').addClass('error')
                });

            // Check if the user already exists
            } else if (result && result.profile._id) {
				user = result.profile._id;
				$('.signup.button').val('Welcome').addClass('green').removeClass('red');
                
                setTimeout( function(){
                    var loginRequest = $.ajax({
                        url: '/login',
                        data: data,
                        method: 'post'
                    }).done(function ( res ) {
                        if (res.results.code == 200) {
                            location.reload();
                        } else {
                            $('.signup.button').val('System Error').addClass('red').removeClass('green');
                        }
                    });
                }, 1000);
			}
			
		});

		event.preventDefault();
	});

    $.fn.serializeObject = function(){

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };

});