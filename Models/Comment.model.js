// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var CommentModel = new Schema({
    comment: String,
    user: { type: Schema.ObjectId, ref: 'user', index: true },
    parent: { type: Schema.ObjectId, index: true },
});
module.exports = { collection: 'comments', schema: CommentModel };