// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 


var Cos = {
	ajax: {
		error: function(xhr){
			Cos.error(Cos.ajax.errorMessage(xhr));
		},
		// Returns the server's ajax error data from a XHR
		errorMessage: function(xhr)
		{
			var error = '';
			try {
				error = JSON.parse(xhr.responseText).error;
			} catch(e) {
				error = xhr.responseText;
			}
			return error;
		}
	},
	
	// Creates a new dialog window
	// Creates the dialog div if it does not exist
	dialog: function(id, data)
	{
		var $dialog = $('#' + id);
		if (!$dialog.length) {
			$dialog = $('<div />').attr('id', id).appendTo($('body'));
		}
		
		if (typeof data === 'string')
			data = { html: data };
		
		$dialog.html(data.html).dialog(data);
	},
	
	// Creates an error dialog
	error: function(error)
	{
		Cos.dialog('error-dialog', {
			html: error,
			title: 'Error',
			buttons: {
				OK: function(){ $(this).dialog('close'); }
			}
		});
	},
	
	// Creates a confirmation dialog
	confirm: function(message, okFunction)
	{
		Cos.dialog('confirm-dialog', {
			html: message,
			title: 'Please Confirm',
			buttons: {
				OK: function(){ $(this).dialog('close'); okFunction(); },
				Cancel: function(){ $(this).dialog('close'); }
			}
		});
	}
};

$(document).ready(function(){
	// jquery stylize all of the buttons
	$('input:submit, button, .button').button();
	
	// Ajax handlers
	$.ajaxSetup({
		error: Cos.ajax.error,
		type: 'POST'
	});
});

$.fn.idFromClass = function(className){
	if (className === undefined) return false;
	
	var results = $(this).attr('class').match(new RegExp(className + '-([a-fA-F0-9]+)'));
	
	return results ? results[1] : false;
};
