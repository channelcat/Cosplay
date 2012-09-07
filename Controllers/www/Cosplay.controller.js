// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var CosplayController = 
{
    name: 'www/Cosplay',
    
	index: function(params) 
	{
	    this.title += 'Cosplays';
	    
		return this.output('index');
	},
    
	manage: function(params) 
	{
	    this.title += 'Manage Cosplays';
        
        if (!this.checkLogin()) return;
	    
    	return chain.call(this, 
    		function(){
		        DB.Cosplay.find({ user: this.user._id }).exec(this.next);
        	}, function(err, cosplays) {
		        if (err) 
					return this.error('Unable to retrieve cosplays.');
		        else 
		        	return this.output('manage', { 
						cosplays: cosplays
					});
        	}
        );
	},
    
	view: function(params) 
	{
	    this.title += 'Viewing a Cosplay';
	    
		return this.output('index');
	},
    
	create: function(params) 
	{
	    this.title += 'Submit Cosplay';
        
        if (!this.checkLogin()) return;

	    if (params.create != undefined) {
	        var result = Validations.Cosplay.create.validate(params);
	        if (result) {
	        	return chain.call(this, 
	        		function(){
				        var cosplay = new DB.Cosplay({ 
                            name: params.name,
                            user: this.user._id,
                            description: params.description
                        });
                        cosplay.save(this.next);
		        	}, function(err, cosplay) {
				        if (err) 
							return this.error('Unable to save cosplay.');
				        else 
				        	return this.redirect({ action: 'view', params: [cosplay._id] });
		        	}
		        );
	        } else {
	        	this.errors = result.errors;
	        }
        }
        
		return this.output('create', {
            validators: [ Validations.Cosplay.create ]
		});
	}
};

module.exports = Class.extend(Controller, CosplayController);
