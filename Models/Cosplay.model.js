// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var CosplayModel = new Schema({
    name: String,
    description: String,
    date: {
    	start: Date,
    	finish: Date,
    	update: Date
    },
    user: { type: Schema.ObjectId, index: true }
});
module.exports = { collection: 'cosplays', schema: CosplayModel };