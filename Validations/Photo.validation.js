var validations = {
    create: [
    	{ field: 'title', length: [1, 50], message: 'Title must be between 1 and 50 characters.' }
    ]
};

module.exports = validations;
