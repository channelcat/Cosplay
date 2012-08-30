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
	    
		return this.output('manage');
	},
    
	create: function(params) 
	{
	    this.title += 'Submit Cosplay';
	    	    
		return this.output('create');
	}
};

module.exports = Class.extend(Controller, CosplayController);
