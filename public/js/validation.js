// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

Validations = {
	add: function(name, validation){
		Validations[name] = validation;
	},
	validate: function( form, validations ) {
		
		var passed = true;
    	var errors = [];
    	
    	for (var v=0; v < Validations[validations].length; ++v) 
    	{
    		var validation = Validations[validations][v];
    		var field = $('[name="'+validation.field+'"]', form);
    		var param = $.trim(field.val());
    		var pass = true;
    		
    		// Existance check
    		if (validation.exists != undefined) {
    			if (param == undefined || param == '') pass = false;
    		}
    		// Length check
    		else if (validation.length != undefined) {
    			if (param == undefined || param.length < validation.length[0] || param.length > validation.length[1]) pass = false;
    		}
    		// Regular expression match check
    		else if (validation.regex != undefined) {
    			var regex = new RegExp(validation.regex);
    			if (param == undefined || !param.match(regex)) pass = false;
    		}
    		// Age check
    		else if (validation.age != undefined) {
    			// Change the field to the last in the list
    			field = $('[name="'+validation.field+'Year"]', form);
    			
    			var selectedDate = 	($('[name="'+validation.field+'Year"]', form).val() || 0) * 10000 +
    								($('[name="'+validation.field+'Month"]', form).val() || 0) * 100 +
    								($('[name="'+validation.field+'Day"]', form).val() || 0) * 1;

    			var currentDate = new Date();
    				currentDate = currentDate.getFullYear() * 10000 + (currentDate.getMonth()+1) * 100 + currentDate.getDate();
    			var minDate = currentDate - validation.age[0] * 10000;
    			var maxDate = currentDate - validation.age[1] * 10000;
    			
    			if ( selectedDate < maxDate || selectedDate > minDate ) pass = false;
    		}
    		
    		// Clear all errors
    		Validations.error.clear(field);
    		
    		// If we failed this pass
    		if (pass == false) { 
    			errors.push({ error: validation.message, field: field, variable: validation.field });
    			passed = false;
    		}
    	}
    	
    	return {
    		passed: passed,
    		errors: errors
    	};
	},
	error: {
		add: function(item, error){
			var $error = $('<span class="error" />').html(error);
			
			$error.css('left', (item.position().left + item.width()) + 'px');
			
			item.after($error);
		},
		clear: function(item){
			item.siblings('span.error').remove();
		}
	}
};

$(document).ready(function(){
	$('form[validation]').each(function(){
		$(this).submit(function(e){
			var result = Validations.validate(this, $(this).attr('validation'));
			
			if (!result.passed) {
				e.preventDefault();
				
				var output = '';
				$.each(result.errors, function(){
					Validations.error.add(this.field, this.error);
				});
			}
		});
	});
});
