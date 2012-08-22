// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var tagSchema = new Schema({
	id: Schema.ObjectId,
	coodinates: {
		x: Number,
		y: Number
	}
});

var PhotoModel = new Schema({
    id: Number,
    title: { type: String },
    tags: {
    	users: [ tagSchema ],
    	props: [ tagSchema ],
    	cosplays: [ tagSchema ]
    }
});

module.exports = { collection: 'photos', schema: PhotoModel };