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
    email: { type: String, inddex: { unique: true } },
    password: String,
    gender: String,
    age: Number,
    birthday: Date,
    link: { type: String, get: function(){ return '<a href="/user/profile/' + escapeHTML(this.name) + '">' + escapeHTML(this.name) + '</a>'; } }
});
module.exports = { collection: 'users', schema: UserModel };