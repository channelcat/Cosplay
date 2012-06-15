// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var System = require("util");

/*************************************************
 ** Built-in type extensions
 *************************************************/

String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.toCamel = function(){
    return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};
String.prototype.capitalize = function(){
    return this.substr(0, 1).toUpperCase() + this.substr(1);
};
String.prototype.toUnderscore = function(){
    return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
};

Array.prototype.each = function(func){
    for ( var i=0; i < this.length; ++i ) {
    	func.apply(this[i], [i]);
    };
};

Object.defineProperty(Object.prototype, "extend", {
    enumerable: false,
    value: function( from ) {
        for (name in from) {
            this[name] = from[name];
        }
        return this;
    }
});
Object.defineProperty(Object.prototype, "each", {
    enumerable: false,
    value: function( func ) {
        var self = this;
        for (name in this) {
    		func.apply(this[name], [name, this[name]]);
        }
    }
});

/*************************************************
 ** Utility Classes
 *************************************************/

Class = {
	create: function(methods) {
		var newClass = function(){
			this.init.apply( this, arguments );
		};
		
		for (m in methods)
			newClass.prototype[m] = methods[m];
			
		return newClass;
	},
	extend: function(baseClass, methods) {
		newClass = Class.create(methods);
		for (m in baseClass)
			newClass[m] = baseClass[m];
		for (m in baseClass.prototype)
			newClass.prototype[m] = baseClass.prototype[m];
		newClass.prototype.super_ = baseClass;
		
		return newClass;
	}
};

Debug = {
	print: function(input) {
		console.log( typeof(input) + ': ' + input);
		console.log(' |-Properties:');
		for (_key in input) {
			console.log(' |-- ' + _key);
			//console.log('   |-' + input[_key]);
		}
		console.log(' |-Prototypes:');
		for (_key in input.prototype) {
			console.log(' |-- ' + _key);
			//console.log('   |-' + input.prototypes[_key]);
		}
	}
};
 
// Make sure we advance using the corrext next
next = function(){ console.log('OUT OF CONTEXT CALL TO NEXT!'); };
chain = function()
{
    // If this.chain exists, context is root, otherwise, context was applied
    var parent = this.chain ? {} : this;
    var functions = arguments;
    var current = 0;
    
    // Execute the next function
    parent.next = function(){
        console.log();
        // If we still have functions to run
        if (current < functions.length) {
            functions[current++].apply(parent, arguments);
        } else {
            parent.last();
        }
    };
    
    // Break the chain
    parent.end = function(){
        // Clear the chain out of memory?
        delete functions;
        delete parent;
    };
    
    // Restart the chain
    parent.first = function(){
        current = 0;
        next.apply(this, arguments);
    };
    
    // Finish the chain
    parent.last = function(){
        current = functions.length-1;
        next.apply(this, arguments);
    };
    
    // Get the ball rolling
    parent.next();
};

var base = __dirname.replace(/\\/g, '/') + '/';
require_base = function(file)
{
    console.log('Requiring ' + base + file + '.js' );
    try { 
        return require( base + file );
    } catch (e) {
        console.log('Failed to require ' + base + file );
    }
};


/*************************************************
 * Image Manipulation
 *************************************************/

ImageManip = require('gm');

/*************************************************
 ** Utility Functions
 *************************************************/

escapeHTML = function(unsafe)
{
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe.replace('<', '&gt;')
                 .replace('>', '&lt;')
                 .replace('"', '&apos;');
}
