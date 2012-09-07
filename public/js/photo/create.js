function photo_create()
{
    $(document).ready(function(){
        
        // File upload
        $('form#photo_create input[name="photo"]').fileupload({
        	dataType: 'json',
        	url: $('form#photo_create').attr('action'),
        	add: function(e, data) {
        		$('.status').html('Starting Upload...');
        		data.submit();
        	},
        	done: function(e, data){
        		console.log('result', data.result);
        		$('.status').html('Done');
        	},
        	error: function(){
        		$('.status').html('Error Uploading');
        	},
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
        		$('.status').html('Uploading ' + progress + '%');
		    }
        });
    });
}
