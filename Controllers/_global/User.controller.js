// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var crypto = require('crypto');

var UserController = 
{
    name: '_global/User',
    
    index: function(params) 
    {
        this.title += 'User Control Panel';
        
        return this.output('index', {});
    },
    
    // Register
    register: function(params) 
    {
        this.title += 'Register';
                
        if (params.register != undefined) {
        	var result = Validations.User.register.validate(params);
            
            // All inputted data passed the validations
			if (result.passed) {
                // Grab the latest user ID and increment by 1                
                chain.call(this,
                    // Fetch the user a unique name based on their email address
                    function(){
                        var continueFunction = this.next;
                        var postfix = '';
                        var name = params.email.match(/^(.+?)\@/)[1];

                        var findFreeUserName = function(){
                            DB.User.findOne({ name: name + postfix }, function(error, user){
                                // Name is free!
                                if (!user) {
                                    params.name = name + postfix;
                                    continueFunction();
                                } else {
                                    postfix = parseInt(Math.random() * 10000000);
                                    findFreeUserName();
                                }
                            });
                            
                        }
                        findFreeUserName();
                    },
                    function(){
                        DB.User.findOne({}, [], {sort:{id:-1}, limit:1}, this.next);
                    },
                    function( error, lastUser ){
                    	var id = 1;
                    	if (lastUser)
                    		id = lastUser.id+1;
                        // Create the user
                        this.user = new DB.User({ 
                            id:             id,
                            email:          params.email,
                            name:    params.name,
                            password:       this._getHash(params.password),
                            birthday:       new Date(params.birthdayYear, params.birthdayMonth - 1, params.birthdayDay)
                        });
                        this.user.save();
                        
                        // Create the session
                        this._createSession(this.user.id);
                        
                        return this.output('registered', {});
                    }
                );
                return;
	        } else {
	          	this.errors = result.errors;
	        }
        }
        
        return this.output('register', {
            months: require_base('Date').months,
            params: params,
            validators: [ Validations.User.register ]
        });
    },
    
    // Log out
    logout: function(params) 
    {
        this.title += 'Log Out';
        
        this.user = { id: 0, name: 'guest', name: 'Guest', loggedIn: false };
        var date = new Date();
        date.setYear(1900);
        this.cookies.set('session', '', { expires: date });
        
        return this.output('logout', {});
    },
    
    // User Profile
    profile: function(params) 
    {
        this.title += 'User Profile';
        
        if (!params.id)
            throw new Error('Cannot find member');
        
        chain.call(this, 
            function(){ DB.User.findOne({ name: params.id }, this.next); }, 
            function(error, user){
                return this.output('profile', {
                    user: user
                });
            }
        );
    },
    
    // Edit User Profile
    edit: function(params) 
    {
        this.title += 'Edit Profile';
        
        if (!this.checkLogin()) return;
        
        return this.output('edit', { 
        	params: params,
            validators: [ Validations.User.profile ]
        });
    },
    
    // Edit User Profile
    save: function(params)
    {
        if (!this.checkLogin()) return;

        if (params.email != undefined) { this.user.email = params.email; }
        if (params.name != undefined) { this.user.name = params.name; }
        if (params.password != undefined && params.password != '') { this.user.password = this._getHash(params.password); }
        if (params.gender != undefined) { this.user.gender = params.gender; }
        if (params.birthdayDay != undefined && params.birthdayMonth != undefined && params.birthdayYear != undefined) { this.user.birthday = new Date(params.birthdayYear, params.birthdayMonth - 1, params.birthdayDay); }
        if (params.profile_type != undefined) { this.user.profile_type = params.profile_type; }
        if (params.biography != undefined) { this.user.biography = params.biography; }
        
        var image;
        chain.call(this, 
            function() 
            {
                if (params.files.avatar && params.files.avatar.size) {
                    image = ImageManip(params.files.avatar.path);
                    image.size(this.next);
                } else {
                    this.last();
                }
            }, 
            function(error, size) 
            {
                if (error) return this.error('Unable to process avatar.  The file is not a valid image. ' + error);
                
                this._cropResize( image, size, Config.user.avatar_size, Config.user.avatar_size );
                
                image.write(this.user.avatar_path, this.next);
            }, 
            function(error) 
            {
                if (error) return this.error('Unable to save avatar.' + error);
                
                // Save the changes made
                this.user.save();
                 
                return this.output('edit', { saved: 1 });
            }
        );
    }
};

module.exports = Class.extend(Controller, UserController);
