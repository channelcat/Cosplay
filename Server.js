// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var sys = require("util");
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var formidable = require('formidable');

var Server = {
    staticFiles: {},
    // Reads a directory and adds it to the static file list
    readDirectory: function (base, directory) {
        var files = fs.readdirSync(base + '/' + directory);
        for ( var f=0; f < files.length; ++f ) {
            var path = directory+'/'+files[f];
            var stat = fs.statSync( base + path );
            // If it is a file, add it to the list
            if (stat.isFile()) {
                this.staticFiles[path] = 1;
            } else if (stat.isDirectory()) {
                this.readDirectory(base, path);
            }
        }
    },
    addFile: function(path) {
    	this.staticFiles[path] = 1;
    },
    removeFile: function(path) {
    	delete this.staticFiles[path];
    },
	init: function( router ) {
	    var self = this;
	    
	    // Build the file list
	    this.readDirectory( Config.server.documentRoot, '' );
	    
		this.server = require('http').createServer( function( request, response ) {
			// Determine the file being requested without the query string
			var queryCheck = request.url.indexOf('?');
			var url = (queryCheck !== -1) ? request.url.substr(0, queryCheck) : request.url;
			
			var dynamic = (request.url.substr(0, 3) === '/d/');
			
			// Request for static/dynamic files
		    if (self.staticFiles[request.url] || dynamic) {
		        console.log( (dynamic ? 'dynamic' : 'static' ) + '! ' + request.url);
                
                // Headers
                var expireDate = new Date();
                expireDate.setTime((new Date()).getTime() + Config.server.cache.static_expire_days*86400);
                
		        // Detect content type
		        var extension = path.extname(url);
		        var contentType = (contentTypes[extension] != undefined) ? contentTypes[extension] : 'text/html';
		        
		        // For dynamic files, read from dynamic root
		        var filePath = dynamic ? 
		        	Config.server.dynamicRoot + url.substr(2) :
		        	Config.server.documentRoot + url;
		        
		        // Serve file!
		        fs.readFile(filePath, function (err, data) {
		        	if (!err) {
	                    response.writeHead( 200, {'content-type': contentType, 'expires': expireDate.toUTCString()} );
	                    response.end(data);
		        	}
		        	else {
		        		console.log('404 for ' + filePath + ':(');
	                    response.writeHead( 404, {'content-type': 'text/html'} );
	                    response.end('File not found');
		        	}
                });
	        } 
	        // Request for APP
	        else {
                console.log('application! ' + request.url);
                
                // Headers
                // response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                
	            // Assemble the post data
                if (request.method == 'POST') {
                    var form = new formidable.IncomingForm();
                    form.parse(request, function(err, fields, files) {
                        request.data = fields.extend({ files: files });
                        router( request, response );
                    });
                } else {
                    request.data = {};
                    router( request, response );
                }
	        }
		});
	},
	listen: function( port, address ) {
		this.server.listen( port, address );
	}
};

var contentTypes = {
    ".avi"      : "video/x-msvideo",
    ".css"      : "text/css",
    ".doc"      : "application/msword",
    ".docx"     : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".flv"      : "video/x-flv",
    ".gif"      : "image/gif",
    ".gz"       : "application/x-gzip",
    ".htm"      : "text/html",
    ".html"     : "text/html",
    ".ico"      : "image/x-icon",
    ".jar"      : "application/java-archive",
    ".java"     : "text/x-java-source",
    ".jpeg"     : "image/jpeg",
    ".jpg"      : "image/jpeg",
    ".js"       : "application/javascript",
    ".json"     : "application/json",
    ".m1v"      : "video/mpeg",
    ".m2a"      : "audio/mpeg",
    ".m2v"      : "video/mpeg",
    ".m3a"      : "audio/mpeg",
    ".m3u"      : "audio/x-mpegurl",
    ".m4u"      : "video/vnd.mpegurl",
    ".m4v"      : "video/x-m4v",
    ".midi"     : "audio/midi",
    ".mov"      : "video/quicktime",
    ".mp3"      : "audio/mpeg",
    ".mp4"      : "video/mp4",
    ".mp4a"     : "audio/mp4",
    ".mp4s"     : "application/mp4",
    ".mp4v"     : "video/mp4",
    ".mpeg"     : "video/mpeg",
    ".mpg"      : "video/mpeg",
    ".mpkg"     : "application/vnd.apple.installer+xml",
    ".oga"      : "audio/ogg",
    ".ogg"      : "audio/ogg",
    ".ogv"      : "video/ogg",
    ".ogx"      : "application/ogg",
    ".png"      : "image/png",
    ".ppt"      : "application/vnd.ms-powerpoint",
    ".pptx"     : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".py"       : "text/x-python",
    ".svg"      : "image/svg+xml",
    ".swf"      : "application/x-shockwave-flash",
    ".tgz"      : "application/x-gzip",
    ".tif"      : "image/tiff",
    ".torrent"  : "application/x-bittorrent",
    ".txt"      : "text/plain",
    ".wma"      : "audio/x-ms-wma",
    ".wmv"      : "video/x-ms-wmv",
    ".xml"      : "application/xml",
    ".xslt"     : "application/xslt+xml",
    ".zip"      : "application/zip"
};

module.exports = Class.create(Server);