// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

$(document).ready(function(){
	// jquery stylize all of the buttons
	$('input:submit, button, .button').button();
	
	// Ajax handlers
	$.ajaxSetup({
		error: function(e){
			var response = e.responseText;
			var error = '';
			try {
				error = JSON.parse(reponse).error;
			} catch(e) {
				error = response;
			}
			Cos.error(error);
		}
	});
});

var Cos = {
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
