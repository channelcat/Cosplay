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
    
	create: function(params) 
	{
	    this.title += 'Gallery';
	    
		return this.output('index');
	}
};

module.exports = Class.extend(Controller, PhotoController);
