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
        this.js_inline = '';
	    
	    this.beforeFilters.push('createSession');
	},
	
	execute: function(action, params, callback)
	{
	    this.renderCallback = callback;
	    this.actionCallback = function(){ 
	        try { this[action](params); } 
	        catch(e) { this.renderCallback('Controller Action Error! ' + e); } 
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
	            this.renderCallback(this.buffer);
	        }
	    }
	},
	
	output: function(name, variables) 
	{		
	    try {
			// Setup extra variables
			if (variables.validators != undefined) {
				var self = this;
				variables.validators.each(function(){
					self.js_inline += this.js();
				});
				delete variables.validators;
			}
            variables.extend(Helpers);
            variables.extend({
                title: this.title,
                errors: this.errors,
                js_inline: this.js_inline,
                currentUser: this.user
            });
		
            var path = './views/' + this.name + '/';
            
            // Render the sub-template
            var template = fs.readFileSync(path + name + '.jade');
            var tplFunction = jade.compile(template);
            
            var body = tplFunction(variables);
            variables.extend({body: body});
            
            // Render the entire layout with the template contents
            template = fs.readFileSync('./views/_global/layout.jade');
            tplFunction = jade.compile(template);
            
            // Render the main template
            this.buffer += tplFunction(variables);
            
            // Execute after filters
            this.filters.current = FILTERS_AFTER;
            if (this.afterFilters.length) {
                for (var f=0; f<this.afterFilters.length; ++f) {
                    this.filters.running++;
                    this[this.afterFilters[f]](params);
                }
            } else {
                this.renderCallback(this.buffer);
            }
	    } catch (e) {
	        this.renderCallback('Render error! ' + e.toString());
	    }
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
    	// Render the error
		this.output('../error', { error: text });
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
    }
};

Controller = Class.create(ControllerClass);