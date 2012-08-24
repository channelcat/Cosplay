// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var UserModel = new Schema({
    id: Number,
    name: { type: String, index: { unique: true } },
    email: { type: String, index: { unique: true } },
    staff: Boolean,
    powers: {
        god: Boolean,
        photos: Boolean,
        cosplays: Boolean,
        animes: Boolean,
        users: Boolean
    },
    password: String,
    gender: String,
    age: Number,
    birthday: Date,
    biography: String,
    has_avatar: Boolean,
    profile_type: Number,
    link: { type: String, get: function(){ return '<a href="/user/profile/' + escapeHTML(this.name) + '">' + escapeHTML(this.name) + '</a>'; } },
    avatar: { type: String, get: function(){ return '<span class="avatar avatar-' + this.id + '"><a href="/user/profile/' + escapeHTML(this.name) + '"><img src="' + this.avatar_url + '" /></a></span>'; } },
    avatar_path: { type: String, get: function(){ return './dynamic/user/avatars/' + this.id + '.png'; } },
    avatar_url: { type: String, get: function(){ return !this.has_avatar ? '/images/icons/user/default_avatar.png' : '/d/user/avatars/' + this.id + '.png'; } }
});

module.exports = { collection: 'users', schema: UserModel };