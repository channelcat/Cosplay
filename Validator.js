// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var fs = require('fs');

Validations = {};

var Validation = {
	init: function()
	{
        var files = fs.readdirSync('./Validations/');
        for ( var f=0; f < files.length; ++f ) {
            var name = files[f].match(/(.+?)\.validation/i)[1];
            var validations = require('./Validations/' + files[f]);
            validations.each(function(key, value){
            	if (Validations[name] == undefined) Validations[name] = {};
            	Validations[name][key] = new Validator( name, key, value );
            });
        }
	}
};

/*
 * Validations
 * 
 * Examples
 * {
 *     name: {regex:'[A-Za-z0-9]', message:'User name can only be '}
 * }
 */
Validator = Class.create({
    init: function( name, validation, validations )
    {
    	this.name = name;
    	this.validation = validation;
        this.validations = validations;
    },
    validate: function(params)
    {
    	var passed = true;
    	var errors = [];
    	
    	for (var v=0; v < this.validations.length; ++v) 
    	{
    		var validation = this.validations[v];
    		var param = params[validation.field];
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
    			var selectedDate = 	(params[validation.field+'Year'] || 0) * 10000 +
    								(params[validation.field+'Month'] || 0) * 100 +
    								(params[validation.field+'Day'] || 0) * 1;

    			var currentDate = new Date();
    				currentDate = currentDate.getFullYear() * 10000 + (currentDate.getMonth()+1) * 100 + currentDate.getDate();
    			var minDate = currentDate - validation.age[0] * 10000;
    			var maxDate = currentDate - validation.age[1] * 10000;
    			
    			console.log('date', maxDate, selectedDate, minDate);
    			
    			if ( selectedDate < maxDate || selectedDate > minDate ) pass = false;
    		}
    		
    		// If we failed this psas
    		if (pass == false) { 
    			errors.push(validation.message);
    			passed = false;
    		}
    	}
    	
    	return {
    		passed: passed,
    		errors: errors
    	};
    },
    js: function()
    {
        return 'Validations.add("' + this.name + '.' + this.validation + '", ' + JSON.stringify(this.validations) + ');';
    }
});

module.exports = Validation;
