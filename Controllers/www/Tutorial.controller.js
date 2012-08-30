// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var TutorialController = 
{
    name: 'www/Tutorial',
    
	index: function(params) 
	{
	    this.title += 'Tutorials';
	    
		return this.output('index');
	},
    
	manage: function(params) 
	{
	    this.title += 'Manage Tutorial';
	    
		return this.output('manage');
	},
    
	create: function(params) 
	{
	    this.title += 'Submit Tutorial';
	    	    
		return this.output('create');
	}
};

module.exports = Class.extend(Controller, TutorialController);
