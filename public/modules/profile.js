$(function() {
	
	$('.upload-cover').click(function(e) {
		$('.cover-uploader').trigger('click');
	});

	$('.cover-uploader').on('change', function (e) {
		var formData = new FormData();
		formData.append("cover", $(this)[0].files[0]);
		$.ajax({
	      url: '/u/cover',
	      type: 'POST',
	      data: formData,
	      processData: false,
	      contentType: false,
	      success: function(data){
	          $('.cover-form .progress-indicator').addClass('hidden').width('100%');
	      	
	      },
	      xhr: function() {
	        // create an XMLHttpRequest
	        var xhr = new XMLHttpRequest();

	        // listen to the 'progress' event
	        xhr.upload.addEventListener('progress', function(evt) {

	          if (evt.lengthComputable) {
	            // calculate the percentage of upload completed
	            var percentComplete = evt.loaded / evt.total;
	            percentComplete = parseInt(percentComplete * 100);
	            $('.cover-form .progress-indicator').removeClass('hidden').width(percentComplete+'%');
	          }

	        }, false);

	        return xhr;
	      }
	    });
	});
	$('.cover-form').ajaxForm();

});