// +----------------------------------------------------------------------+ 
// | Copyright (c) 2011-2012 Channel Cat                                  | 
// +----------------------------------------------------------------------+ 
// | This source file is bound by United States copyright law.            | 
// +----------------------------------------------------------------------+ 
// | Author: Michael Hill <channelcat@gmail.com>                          | 
// +----------------------------------------------------------------------+ 

var helpers = {
    form: {
        select: function(name, options, value) {
            var output = '<select name="' + escapeHTML(name) + '" id="select-' + escapeHTML(name) + '">';
            for ( var o=0; o < options.length; ++o ) {
                output += '<option value="' + escapeHTML(options[o].value) + '"' + (options[o].value == value ? 'selected="selected"' : '') + '>' + escapeHTML(options[o].name) + '</option>';
            }
            output += '</select>';
            return output;
        },
        // Generates a date selection field (3 selection boxes)
        date: function(name, date) {
            if (date === undefined) {
                date = new Date();
            }
            
            var days = [];
            var years = [];
            var year = (new Date()).getFullYear();
            var months = require_base('Date').months;
            for ( var y=0; y<110; ++y ) { years.push({ name: year - y, value: year - y }); }
            for ( var d=1; d<32; ++d ) { days.push({ name: d, value: d }); }
            
            var output = '';
            
            output += helpers.form.select(name+'Month', months, date.getMonth()+1) + ' ';
            output += helpers.form.select(name+'Day', days, date.getDate()) + ' ';
            output += helpers.form.select(name+'Year', years, date.getFullYear());

            return output;
        }
    }
};

module.exports = helpers;