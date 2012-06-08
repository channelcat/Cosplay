var validations = {
    register: [
    	{ field: 'email', length: [1, 70], message: 'Please enter an email address.' },
    	{ field: 'email', regex: '^[A-z0-9._%-]+@[A-z0-9.-]+\\.[A-z]{2,4}$', message: 'Please enter a valid email address.' },
    	{ field: 'password', length: [1, 32], message: 'Please enter a password.' },
        { field: 'birthday',  age: [13, 110], message: 'You must be 13 years of age or older to use this site.' }
    ],
    profile: [
    	{ field: 'name', length: [1, 25], message: 'Please enter a display name between 1 and 25 characters.' },
    	{ field: 'name', regex: '^[A-z0-9 ]*$', message: 'Display names must only contain characters, spaces, and numbers.' },
        { field: 'birthday',  age: [13, 110], message: 'You must be 13 years of age or older to use this site.' },
        { field: 'gender',  values: ['M', 'F', ''], message: 'Please select a gender.' },
        { field: 'biography',  length: [0, 10000], message: 'Biography may not be more than 10,000 characters' },
        { field: 'profileType',  values: ['1', '2'], message: 'Please select a profile type.' }
    ]
};

module.exports = validations;
