// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var TagModel = new Schema({
    date:       { create: { type: Date, 'default': Date.now } },
    tagger:     { type: Schema.ObjectId, index: true },
    dimensions: { x: Number, y: Number, width: Number, height: Number },
    parent:     { type: Schema.ObjectId, index: true },
    child:      { type: Schema.ObjectId, index: true }
});
module.exports = { collection: 'tags', schema: TagModel };