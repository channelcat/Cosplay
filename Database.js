// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var fs = require('fs');
var mongoose = require('mongoose/');

Schema = mongoose.Schema;
DB = {};

var Database = {
    connect: function( host, port, database, callback ) {
        Database.connection = mongoose.connect( 'mongodb://' + host + ':' + port + '/' + database, {} );
        var files = fs.readdirSync('./models/');
        for ( var f=0; f < files.length; ++f ) {
            var name = files[f].match(/(.+?)\.model/i)[1];
            var model = require('./models/' + files[f]);
            DB[name] = mongoose.model(model.collection, model.schema);
        }
    }
};

module.exports = Database;