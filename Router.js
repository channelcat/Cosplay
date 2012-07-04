// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var Router = {
    // Finds a controller / action for the current route
	get: function( host, url ) {
	    // URL is unknown
	    if (url[0] != '/')
	       return false;
	    
		var parts = url.split('/');
		var controller, controllerName;
		var action, actionName;
		var params = {};
		
        // Remove the empty first element
        parts.shift();
        
        // Remove possible empty last element (url ends with /)
        if(parts[parts.length-1].length == 0)
            parts.pop();
		
		// URL is /
        if (parts.length == 0) {
            controllerName = 'Index';
            actionName = 'index';
        }
        // Just a controller
        else if (parts.length == 1) {
            controllerName = parts[0].toCamel().capitalize();
            
            actionName = 'index';
        }
        // Just a controller
        else {
            controllerName = parts[0].toCamel().capitalize();
            
            actionName = parts[1].toCamel();
            // If there's only 1 parameter, label it ID
            if (parts.length == 3) {
                params = { id: parts[2] };
            // If there are parameters, let's pass them as key/value pairs
            } else if (parts.length > 3) {
                for (var p=2; p<parts.length; p+=2) {
                    params[parts[p]] = params[parts[p+1]];
                }
            }
        }
        
        // Load controller
        try {
            controller = require('./Controllers/' + host + '/' + controllerName + '.controller');
        } catch(e1) { 
            try {
                controller = require('./Controllers/_global/' + controllerName + '.controller');
            } catch(e2) { 
                console.log('Could not find controller ' + './Controllers/' + host + '/' + controllerName + '.controller - ' + e1.toString());
                return false; 
            }
        }
        
        // If there is no action available, 404!
        if (controller.prototype[actionName] == undefined)
            return false;
		
		return {
			url: url,
			host: host,
			controller: controller,
			action: actionName,
			params: params
		};
	}
};

module.exports = Router;

