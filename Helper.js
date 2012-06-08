// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var fs = require('fs');

Helpers = {};

var Helper = {
    init: function( host, port, database, callback ) {
        var files = fs.readdirSync('./helpers/');
        var helpers = {};
        for ( var f=0; f < files.length; ++f ) {
            var name = files[f].match(/(.+?)\.helper/i)[1];
            var helper = require('./helpers/' + files[f]);
            Helpers = Helpers.extend(helper);
        }
        return helpers;
    }
};

module.exports = Helper;