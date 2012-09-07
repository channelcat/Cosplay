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
    	start: { type: Date, 'default': Date.now },
    	finish: Date,
    	update: Date
    },
    user: { type: Schema.ObjectId, ref: 'users', index: true },
    link: { 
		view: { type: String, get: function(){ return '<a href="/cosplay/view/' + this._id + '"><span>' + escapeHTML(this.name) + '</span></a>'; } },
		edit: { type: String, get: function(){ return '<a href="/cosplay/edit/' + this._id + '"><span>' + escapeHTML(this.name) + '</span></a>'; } }
	}
});
module.exports = { collection: 'cosplays', schema: CosplayModel };