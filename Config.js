// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

Config = {
	server: {
		address: '127.0.0.1',
		port: 80,
		domain: 'cosbomb.com',
		documentRoot: 'public',
		dynamicRoot: 'dynamic',
		cache: {
			static_expire_days: 7,
		}
	},
	database: {
	    address: '127.0.0.1',
	    port: 27017,
	    database: 'lostcos'
	},
	site: {
	    title: 'Cosbomb - ',
	    salt: 'H*AF(*hfz09ag3-j0gd90#%0J'
	},
	user: {
	    avatar_size: 75
	}
};