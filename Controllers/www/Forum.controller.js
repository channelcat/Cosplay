// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var ForumController = 
{
    name: 'www/Forum',
    
	index: function(params) 
	{
	    this.title += 'Forum';
	    
		return this.output('index');
	}
};

module.exports = Class.extend(Controller, ForumController);
