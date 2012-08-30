// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var PhotoController = 
{
    name: 'www/Photo',
    
	index: function(params) 
	{
	    this.title += 'Gallery';
	    
		return this.output('index');
	},
    
	manage: function(params) 
	{
	    this.title += 'Manage Photos';
	    
		return this.output('manage');
	},
    
	create: function(params) 
	{
	    this.title += 'Submit Photo';
	    
	    if (params.create != undefined) {
	    	return this.redirect({ action: 'view', params: [ 1 ] });
	    }
	    
		return this.output('create');
	}
};

module.exports = Class.extend(Controller, PhotoController);
