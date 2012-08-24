function user_edit()
{
    $(document).ready(function(){
        $('form#user_edit').submit(function(e){
        	e.preventDefault();
        	
        	$('form#user_edit input[type="submit"]').val('Sending');
        	
        	$.ajax({
        		url: '/user/save',
        		data: $('form#user_edit').serialize(),
        		success: function(data) {
        			$('form#user_edit input[type="submit"]').val('Saved');
        		},
        		error: function(data) {
        			$('form#user_edit input[type="submit"]').val('Error');
        		},
        		complete: function(data) {
        			setTimeout(function(){
        				$('form#user_edit input[type="submit"]').val('Submit');
        			}, 1000);
        		}
        	});
        });
        
        // File upload
        $('form#user_avatar input[name="avatar"]').fileupload({
        	dataType: 'json',
        	url: $('form#user_avatar').attr('action'),
        	add: function(e, data) {
        		$('#user_avatar .avatar-status').html('Starting Upload...');
        		data.submit();
        	},
        	done: function(e, data){
        		var newURL = data.result.url + '?' + Math.random();
        		// Set status to custom
        		$('#user_avatar .avatar-status').html('Custom Avatar');
        		// Update all avatars on the page
        		$('.avatar-' + data.result.id + ' img').attr('src', newURL);
        	},
        	error: function(){
        		$('#user_avatar .avatar-status').html('Error Uploading');
        	},
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
        		$('#user_avatar .avatar-status').html('Uploading ' + progress + '%');
		    }
        });
    });
}
