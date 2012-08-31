// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var TagController = 
{
    name: 'www/Tag',
    
	add: function(params) 
	{
		return this.output_json({ saved: true });
	},
    
	remove: function(params) 
	{
		return this.output_json({ removed: true });
	}
};

module.exports = Class.extend(Controller, TagController);
