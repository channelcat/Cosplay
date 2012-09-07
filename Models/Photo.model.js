// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var PhotoModel = new Schema({
    title: { type: String },
    name: { type: String, get: function(){ return (this.title !== undefined) ? this.title : this.date.create } },
    description: { type: String },
    date: {
    	create: { type: Date, 'default': Date.now },
    	upload: Date
    },
    tags: { type: Schema.ObjectId, ref: 'tags', index: true },
    user: { type: Schema.ObjectId, ref: 'users', index: true },
    published: Boolean,
	thumbnail: { 
		path: { type: String, get: function(){ return './dynamic/photo/thumb/' + this._id + '.png'; } },
		url: { type: String, get: function(){ return '/d/photo/thumb/' + this._id + '.png'; } },
		link: { type: String, get: function(){ return '<a href="/photo/view/' + this._id + '"><img src="' + this.thumbnail.url + '""></a>'; } },
	},
	image: { 
		extension: String,
		width: Number,
		height: Number,
		path: { type: String, get: function(){ return './dynamic/photo/image/' + this._id + '.' + this.image.extension; } },
		url: { type: String, get: function(){ return '/d/photo/image/' + this._id + '.' + this.image.extension; } }
	},
    link: { 
		view: { type: String, get: function(){ return '<a href="/photo/view/' + this._id + '">' + escapeHTML(this.name) + '</a>'; } },
		edit: { type: String, get: function(){ return '<a href="/photo/edit/' + this._id + '">' + escapeHTML(this.name) + '</a>'; } }
	}
});

module.exports = { collection: 'photos', schema: PhotoModel };