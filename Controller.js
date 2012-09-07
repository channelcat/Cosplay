// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var jade = require('jade');
var fs = require('fs');
var cookies = require('cookies');
var crypto = require('crypto');

var FILTERS_BEFORE = 0;
var FILTERS_AFTER = 1;

var RENDER_MODE_HTML = 1;
var RENDER_MODE_JSON = 2;

var ControllerClass = {
    
	init: function( request, response ){
	    this.user = { id: 0, name: 'guest', displayName: 'Guest', loggedIn: false };
	    this.beforeFilters = [];
	    this.afterFilters = [];
	    this.errors = [];
	    this.filters = { current: 0, running: 0 };
	    this.buffer = '';
        this.cookies = new cookies( request, response );
        this.title = Config.site.title;
        this.tpl_js_inline = '';
        this.tpl_header = '';
        
        // Request Data
		this.request = request;
		this.renderSettings = {};
		// Do we expect JSON or HTML?
		this.renderMode(this.request.headers['x-requested-with'] === 'XMLHttpRequest' ? RENDER_MODE_JSON : RENDER_MODE_HTML);
	    
	    this.beforeFilters.push('createSession');
	},
	
	renderMode: function(mode)
	{
		this.renderSettings.mode = mode;
		switch (mode) {
			case RENDER_MODE_HTML:
				this.renderSettings.contentType = 'text/html';
				break;
			case RENDER_MODE_JSON:
				this.renderSettings.contentType = 'text/json';
				break;
		}
	},
	
	execute: function(action, params, response)
	{
	    this.response = response;
	    this.actionCallback = function(){ 
	        try { this[action](params); } 
	        catch(e) { this.renderError('Controller Action Error! ' + e); } 
	    };
	    
	    // Execute before filters
	    this.filters.current = FILTERS_BEFORE;
	    if (this.beforeFilters.length) {
	        for (var f=0; f<this.beforeFilters.length; ++f) {
	            this.filters.running++;
	            this[this.beforeFilters[f]](params);
	        }
	    } else {
            this.actionCallback();
	    }
	},
	
	filterComplete: function()
	{
	    --this.filters.running;
	    if (this.filters.running < 1) {
	        if (this.filters.current == FILTERS_BEFORE) {
	            this.actionCallback();
	        } else {
	            this.renderSuccess(this.buffer);
	        }
	    }
	},
	
	output: function(name, variables) 
	{		
	    try {
            // ------------------------------------------- //
            // Variables
            // ------------------------------------------- //
            
	    	if (variables === undefined) variables = {};
			if (variables.validators != undefined) {
				var self = this;
				variables.validators.each(function(){
					self.tpl_js_inline += this.js();
				});
				delete variables.validators;
			}
            variables.extend(Helpers);
            variables.extend({
                title: this.title,
                errors: this.errors,
                currentUser: this.user
            });
            
            // ------------------------------------------- //
            // Render Sub-template
            // ------------------------------------------- //
            
            var path = './Views/' + this.name + '/';
            
            // Render the sub-template
            var template = fs.readFileSync(path + name + '.jade');
            var tplFunction = jade.compile(template);
            
            var body = tplFunction(variables);
            
		
            // ------------------------------------------- //
            // Header Items
            // ------------------------------------------- //
            if (variables.js !== undefined) {
            	for ( var j=0; j < variables.js.length; ++j ) {
            		var name = variables.js[j];
            		
            		// TODO: combine files
            		this.tpl_header += '<script src="/js/' + name + '.js" type="text/javascript"></script>';
            		// Add the execution code
            		this.tpl_js_inline += name.replace(/\//g, '_') + '();';
            	}
            }
            variables.header = this.tpl_header + '<script type="text/javascript">' + this.tpl_js_inline + '</script>';
            
            // ------------------------------------------- //
            // Render Layout
            // ------------------------------------------- //
            
            variables.extend({ body: body });
            
            template = fs.readFileSync('./Views/_global/layout.jade');
            tplFunction = jade.compile(template);
            
            // Render the main template
            this.buffer += tplFunction(variables);
            
            // ------------------------------------------- //
            // After Filters
            // ------------------------------------------- //
            
            this.filters.current = FILTERS_AFTER;
            if (this.afterFilters.length) {
                for (var f=0; f<this.afterFilters.length; ++f) {
                    this.filters.running++;
                    this[this.afterFilters[f]](params);
                }
            } else {
                this.renderSuccess(this.buffer);
            }
	    } catch (e) {
	        this.renderError('Render error! ' + e.toString());
	    }
	},
	
	add_js: function(file)
	{
		this.tpl_header += '<script type="text/javascript" src="/js/' + file + '.js"></script>';
	},
	
	output_json: function(variables) 
	{
		this.renderMode(RENDER_MODE_JSON);
    	this.renderSuccess(JSON.stringify(variables));
	},
	
	createSession: function(params)
	{
	    var sessionCookie = this.cookies.get('session');

        if ( params.login != undefined && params.email != undefined && params.password != undefined ) {
	        console.log('Login! ' + params.email);
            var password_hash = this._getHash(params.password);
        
            chain.call(this, 
                function(){ DB.User.findOne({email: params.email}, this.next); },
                function(error, user){
                    // User not found!
                    if (!user) {
                        this.errors.push('Account not found.');
                    // Password incorrect!
                    } else if (user.password != password_hash) {
                        this.errors.push('Password incorrect.');
                    // Login correct!
                    } else {
                        this.user = user;
                        this.user.loggedIn = true;
                        
                        // Create session
                        this._createSession(this.user.id);
                    }
                    this.next();
                },
                this.filterComplete
            );
        // User has a session stored
        } else if ( sessionCookie != undefined ) {
            console.log('Session! ' + sessionCookie);
            
            chain.call( this,
                function(){ DB.Session.findOne({id: sessionCookie}, this.next); },
                function( error, session ){ 
                    if (!session) {
                        // Expire the cookie
                        this.errors.push('Session invalid');
                        this._removeSession();
                        this.filterComplete();
                        return;
                    }
                    DB.User.findOne({id: session.userId}, this.next);
                },
                function( error, user ) {
                    if (!user) {
                        // Expire the cookie
                        this.errors.push('Session invalid');
                        this._removeSession();
                        this.filterComplete();
                        return;
                    }
                    this.user = user;
                    this.user.loggedIn = true;
            
                    return this.next();
                },
                this.filterComplete
            );
        } else {
            this.filterComplete();
        }
    },
    
    /**
     * Checks if the current user is logged in and errors if not
     */
    checkLogin: function(input) {
    	// Render the error if not logged in
    	if (!this.user.loggedIn)
            this.error('You must log in to view this page');
    	
    	return this.user.loggedIn;
    },
    
    /**
     * Renders an error page
     */
    error: function(text) {
    	// JSON Error
    	if (this.renderSettings.mode === RENDER_MODE_JSON) {
    		this.renderError(JSON.stringify({ error: text }));
    	} 
    	// HTML Error
    	else {
			this.output('../../_global/error', { error: text });
    	}
    },
    
    /**
     * Gets the hash of a string, with the salt
     */
    _getHash: function(input) {
        var shasum = crypto.createHash('sha1');
        shasum.update(input + Config.site.salt);
        return shasum.digest('hex');
    },
    
    /**
     * Creates a cookie-based session from a user ID
     */
    _createSession: function(userId) {
        // Clear old sessions under that userID
        DB.Session.remove({ userId: userId });
        
        // Create random session ID hash
        shasum = crypto.createHash('sha1');
        shasum.update(crypto.randomBytes(32));
        
        // Create and save session in the database
        var sessionId = shasum.digest('hex');
        var session = new DB.Session({ id: sessionId, userId: userId }).save();
        
        // Create the session cookie
        this.cookies.set('session', sessionId);
        
        // Logged in
        this.user.loggedIn = true;
    },
    
    /**
     * Wipes the current session
     */
    _removeSession: function(sessionId) {
        // Remove old session if the ID was passed
        if (typeof sessionId != 'undefined') {
            DB.Session.remove({ id: sessionId });
        }
        
        // Set the session to expire in the past
        var date = new Date();
        date.setYear(1900);
        this.cookies.set('session', '', { expires: date });
    },
    
    /**
     * Resizes and crops an image based on the inputted height and
     * width.
     * 
	 * @param {Object} image handle
	 * @param {Object} image size
	 * @param {Object} new width
	 * @param {Object} new height
     */
    _cropResize: function(image, size, newWidth, newHeight)
    {
        // If the image is not the same dimensions as an avatar
        if ( size.width != newWidth || size.height != newHeight ) {
            
            // If an image is not the same aspect ratio of an avatar
            var inputRatio = size.width/size.height;
            var newRatio = newWidth / newHeight;
            
            var resizeWidth = newWidth;
            var resizeHeight = newHeight;
            
            // If the inputted image is wider than the avatar
            if (inputRatio > newRatio) {
                resizeWidth = size.width * newHeight / size.height;
            }
            // // If the inputted image is taller than the avatar
            if (inputRatio < newRatio) {
                resizeHeight = size.height * newWidth / size.width;
            }
            
            // do the deed
            image.resize(resizeWidth, resizeHeight);
            
            // Crop the resized image if it does not match the new dimensions
            if (newWidth != resizeWidth || newHeight != resizeHeight)
                image.crop(newWidth, newHeight, (resizeWidth - newWidth) / 2, (resizeHeight - newHeight) / 2);
        }
    },
    
    renderSuccess: function(output)
    {
        this.response.writeHead( 200, {'content-type': this.renderSettings.contentType} );
    	this.response.end(output);
    	this.response.finished = true;
    },
    renderError: function(output)
    {
        this.response.writeHead( 500, {'content-type': this.renderSettings.contentType} );
    	this.response.end(output);
    	this.response.finished = true;
    },
    
	/**
	 * Redirects a request using the location header 
	 */
	redirect: function(location)
	{
		// If an object was passed in, redirect to a controller action instead
		if (typeof location === 'object') {
			location = '/' + this.name.substr(this.name.indexOf('/') + 1).toLowerCase() + '/' + location.action.toLowerCase() + '/' + location.params.join('/');
		}
		console.log('redirect! ' + location);
		
        this.response.writeHead( 302, { 'Location': location } );
    	this.response.end('');
    	this.response.finished = true;
	},
};

Controller = Class.create(ControllerClass);