// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

// Global Code
require('./Config');
require('./Utils');
require('./Controller');

// Modules
var Database = require('./Database');
var Server = require('./Server');
var Router = require('./Router');
var Validation = require('./Validator');
var Helper = require('./Helper');

var server = new Server(function(request, response) {
    try {
        var route = Router.get('www', request.url);
        if (route == false) 
            throw(new Exception('Route not found'));
        // Add the post data into the request params
        route.params.extend(request.data);
            
        var controller = new route.controller(request, response);
        try {
        	// Give the controller 3 seconds to render or just cut it off
            var timer = setTimeout(function(){
                if (!response.finished) {
                    response.writeHead( 500, {'content-type': 'text/html'} );
                    response.end('500d!  Infinite poop :( ' + controller.name);
                    console.log('had to kill ', route);
                }
                delete response;
            }, 3000);
            
            controller.execute(route.action, route.params, response);
        } catch (e) {
            response.writeHead( 500, {'content-type': 'text/html'} );
            response.end('500d!  We encountered an error while processing your request :( ' + e.toString());
        }
    } catch (e) {
        response.writeHead( 404, {'content-type': 'text/html'} );
        response.end('404d!  Could not find what you were looking for :( ' + e.toString());
    }
});

console.log('Initializing data...');
Validation.init();
Helper.init();
console.log('Done!');

console.log('Connecting to database...');
Database.connect( Config.database.address, Config.database.port, Config.database.database);
console.log('Connection established!');
            
console.log('Starting web service...');
server.listen( Config.server.port, Config.server.host );
console.log('Server running on port ' + Config.server.port);