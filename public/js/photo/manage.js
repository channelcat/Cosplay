function photo_manage()
{
    $(document).ready(function(){
    	$('.photo-manage .delete').click(function(e){
    		e.preventDefault();
    		
    		var self = this;
    		Cos.confirm('Are you sure you wish to remove this photo?', function(){
    			var $photo = $(self).closest('.photo');
    			var id = $photo.idFromClass('photo');
    		
    			$.ajax({
    				url: '/photo/delete/',
    				data: { ids: [id] },
    				success: function() {
    					$photo.fadeOut();
    				}
    			});
    		});
    	});
    });
}
