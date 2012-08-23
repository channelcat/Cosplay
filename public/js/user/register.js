var user_register = function(){
	var email_okay = true;
	
	$(document).ready(function(){
		
		// Email in use check
		var email_timeout = null;
  		$('#register form input[name="email"]').bind('keyup', function(e){
  			if (email_timeout != null) {
  				clearTimeout(email_timeout);
  				email_timeout = null;
  			}
  			
  			email_timeout = setTimeout(function(){
  				$('#register_email_check').html('<span class="loading" />').removeAttr('class');
  				
  				$.ajax({
  					url: '/user/check_email',
  					data: { email: $('#register input[name="email"]').val() },
  					success: function(data){
  						email_okay = true;
  						$('#register_email_check').addClass('success').html(data.message);
  					},
  					error: function(xhr){
  						email_okay = false;
  						$('#register_email_check').addClass('error').html(Cos.ajax.errorMessage(xhr));
  					}
  				});
  			}, 800);
  		});
		
		// Stop them from submitting if the user name is invalid
  		$('#register form').submit(function(e){
  			if (!email_okay) {
  				e.preventDefault();
  			}
  		});
	});
}
