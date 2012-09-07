// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var PhotoController = 
{
    name: 'www/Photo',
    
	index: function(params) 
	{
	    this.title += 'Gallery';
	    
		return this.output('index');
	},
    
	view: function(params) 
	{
	    this.title += 'Photo View';
	    
    	return chain.call(this, 
    		function(){
		        DB.Photo.findOne({ _id: params.id }).exec(this.next);
        	}, function(err, photo) {
		        if (err) 
					return this.error('Unable to retrieve photo.');
		        else 
		        	return this.output('view', { photo: photo });
        	}
        );
	},
    
	manage: function(params) 
	{
	    this.title += 'Manage Photos';
        
        if (!this.checkLogin()) return;
	    
    	return chain.call(this, 
    		function(){
		        DB.Photo.find({ user: this.user._id }).exec(this.next);
        	}, function(err, photos) {
		        if (err) 
					return this.error('Unable to retrieve photos.');
		        else 
		        	return this.output('manage', { 
						photos: photos
					});
        	}
        );
	},
    
	create: function(params) 
	{
	    this.title += 'Submit Photo';
        
        if (!this.checkLogin()) return;
	    
        this.add_js('external/fileupload/jquery.fileupload');
        this.add_js('external/fileupload/jquery.iframe-transport');
        
		return this.output('create', { js: ['photo/create'] });
	},
    
	upload: function(params) 
	{
        if (!this.checkLogin()) return;
	    
        var image, photo, size;
        chain.call(this, 
            function() 
            {
                if (params.files.photo && params.files.photo.size) {
                    image = ImageManip(params.files.photo.path);
                    image.size(this.next);
                } else {
                    return this.error('Photo not received.');
                }
            }, 
            function(error, _size) 
            {
                if (error) return this.error('Unable to process photo.  The file is not a valid image. ' + error);
                size = _size;
                
                if (size.width > Config.photo.dimensions.upload.width ||
                	size.height > Config.photo.dimensions.upload.height)
                	return this.error('Unable to resize photo.  The photo is just too big for our poor servers.  The maximum size we can handle is ' + Config.photo.dimensions.upload.width + ' x ' + Config.photo.dimensions.upload.height + '.');
                
		        photo = new DB.Photo({ 
                    user: this.user._id
                });
                photo.save(this.next);
            }, 
            function(error) 
            {
                if (error) return this.error('Unable to create photo in database.  ' + error);
                // Grab the image type for the file extension
                image.format(this.next);
            },
            function(error, format) 
            {
                if (error) return this.error('Unable to determine photo type.  ' + error);
                
                photo.image.extension = format;
                
                // Only size it down if needed
                if (size.width > Config.photo.dimensions.limit.width ||
                	size.height > Config.photo.dimensions.limit.height)
            		image.resize(Config.photo.dimensions.limit.width, Config.photo.dimensions.limit.height);
            		
                image.write(photo.image.path, this.next);
            }, 
            function(error) 
            {
                if (error) return this.error('Unable to save Full size image.' + error);
                
                image.size(this.next);
            },
            function(error, size) 
            {
                if (error) return this.error('Unable to process full photo size.  ' + error);
                
                photo.image.width = size.width;
                photo.image.height = size.height;
                
                this._cropResize( image, size, Config.photo.dimensions.thumbnail.width, Config.photo.dimensions.thumbnail.height );
                
                image.write(photo.thumbnail.path, this.next);
            },
            function(error, size) 
            {
                if (error) return this.error('Unable to save thumbnail.  ' + error);
                
                // Save the changes made
                photo.save();
                
                return this.output_json({ saved: 1, photo: { image: photo.image.url, thumbnail: photo.thumbnail.url } });
            }
        );
	}
};

module.exports = Class.extend(Controller, PhotoController);
