// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var IndexController = 
{
    name: 'www/Index',
	index: function(params) 
	{
	    this.title += 'Home';
	    
		return this.output('index', {
		    test: 'lol'
		});
	}
};

module.exports = Class.extend(Controller, IndexController);
