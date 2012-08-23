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
  				$('#register_email_check').html('<span class="loading" />');
  				
  				$.ajax({
  					url: '/user/check_email',
  					success: function(){
  						$('#register_email_check').html('Email okay!');
  					},
  					errorz: function(){
  						$('#register_email_check').html('Email in use :(');
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
