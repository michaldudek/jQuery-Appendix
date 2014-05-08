/*! jQuery Appendix - v0.8.4
* A small set of functions appended to jQuery that make your life even easier.
*
* https://github.com/michaldudek/jQuery-Appendix
*
* Copyright (c) 2013 Michał Dudek, http://www.michaldudek.pl, michal@michaldudek.pl
* MIT License, https://github.com/michaldudek/jQuery-Appendix/blob/master/LICENSE.md
*/

/*global jQuery, Math*/
(function($, window, document, Math, undefined) {
    "use strict";

    // cache few helper variables
    var $body = $('body'),
        $html = $('html'),
        $htmlAndBody = $html.add($body),
        $win = $(window);

    $.extend($, {

        /**
         * Shortcut to $.ajax with some default parameters. Enforces URL for a request and takes it as the 1st parameter.
         *
         * @param  {String} url URL to which make the AJAX request.
         * @param  {Object} opt[optional] An object of optional options.
         * @return {jqXHR} Whatever jQuery's $.ajax returns.
         */
        request : function(url, options) {
            if (!url) {
                throw new TypeError('jQuery.request() - 1st parameter (url) is required!');
            }

            // merge the options with defaults
            var opt = $.extend(true, {
                url : url,
                type : 'GET',
                dataType : 'json',
                data : null,
                form : null
            }, options);

            // is any data being sent? this includes form data (in 'form' option)
            if (opt.data || opt.form) {
                // change type to POST but only if it isn't forced by original passed options
                if (options.type === undefined) {
                    opt.type = 'POST';
                }

                // add post data from a form
                var formData = '';
                if (opt.form) {
                    $(opt.form).each(function() {
                        var _data = $(this).serialize();
                        if (_data.length > 0) {
                            formData += _data;
                        }
                    });
                    opt.form = null; // unset
                }

                var data = opt.data ? $.param(opt.data) : '';

                // merge all the data
                opt.data = formData + data;
            }

            return $.ajax(opt);
        },

        /*
         * TOOLS THAT EXTEND BASIC OBJECTS
         * but can't be in their prototypes
         */
        /*
         * OBJECT
         */
        object : {

            /**
             * Returns Object's size.
             * NOTE: Not usable on DOM Objects!
             *
             * @param  {Object} obj
             * @return {Number}
             */
            size : function(obj) {
                var size = 0,
                    key;

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        size++;
                    }
                }

                return size;
            },

            /**
             * Sorts an object if it's a simple key-value (numeric) pair.
             * 
             * @param  {Object} obj  Object to be sorted.
             * @param  {Boolean} desc [optional] Sort descending? Default: false.
             * @return {Array} Sorted array in the form of [(key), (value)].
             */
            sort : function(obj, desc) {
                desc = desc || false;
                var sortable = [];

                $.each(obj, function(key, value) {
                    sortable.push([key, value]);
                });

                sortable.sort(function(a, b) {
                    return a[1] - b[1];
                });

                if (desc) {
                    sortable.reverse();
                }

                return sortable;
            }

        },

        /*
         * ARRAY
         */
        array : {

            /**
             * Returns unique values of the array.
             *
             * @param {Array} arr Array to be made unique.
             * @return {Array}
             */
            unique : function(arr) {
                var obj = {},
                    res = [],
                    i;

                for (i = 0; i < arr.length; i++) {
                    obj[typeof arr[i] + arr[i]] = arr[i];
                }

                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        res.push(obj[i]);
                    }
                }

                return res;
            }

        },

        /*
         * STRING
         */
        string : {

            /**
             * Parses the string looking for variables to insert from the given set of variables.
             * Ie. looks for occurrences of {$foo} or {bar} and replaces them with values found
             * under 'foo' and 'bar' keys of the passed object.
             *
             * @param {String} str String to have the variables injected.
             * @param {Object} variables[optional] Object containing variables to be injected.
             * @return {String}
             */
            parseVariables : function(str, variables) {
                variables = variables || {};

                return str.replace(/\{(\$?[\w\d]+)\}/gi, function(match, key) {
                    var dollar = (key.substr(0, 1) === '$'); // has dollar sign?
                    if (dollar) {
                        key = key.substr(1);
                    }

                    if (variables[key] === null) {
                        return '';
                    }

                    if (variables[key] !== undefined) {
                        return variables[key];
                    }

                    if (!dollar) {
                        return '{' + key + '}';
                    }

                    return '';
                });
            },

            /**
             * Generate a random string of a given length.
             *
             * @param {Number} length[optional] Length of the string. Default: 16
             * @param {Boolean} capitals[optional] Should the string include capital letters? Default: true
             * @param {Boolean} punctuation[optional] Should the string include special characters like punctuation? Default: false
             * @return {String}
             */
            random : function(length, capitals, punctuation) {
                length = length || 16;
                capitals = !(!capitals || false);
                punctuation = punctuation || false;

                var str = '',
                    chars = '1234567890abcdefghijkmnopqrstuvwxyz';

                if (capitals) {
                    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                }

                if (punctuation) {
                    chars += '?!.,;:^#@&';
                }

                for (var i = 1; i <= length; i++) {
                    str = str + chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
                }

                return str;
            },

            /**
             * Trims the string of spaces or the given charlist.
             * This method is taked from PHP.JS project (phpjs.org)
             *
             * @param {String} str String to be trimmed.
             * @param {String} chars[optional] Optional list of characters that should be trimmed.
             * @return {String}
             */
            trim : function(str, chars) {
                var ws,
                    l = 0,
                    i = 0;
             
                if (!chars) {
                    // default list
                    ws = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
                } else {
                    // preg_quote custom list
                    chars += '';
                    ws = chars.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
                }
             
                l = str.length;
                for (i = 0; i < l; i++) {
                    if (ws.indexOf(str.charAt(i)) === -1) {
                        str = str.substring(i);
                        break;
                    }
                }
             
                l = str.length;
                for (i = l - 1; i >= 0; i--) {
                    if (ws.indexOf(str.charAt(i)) === -1) {
                        str = str.substring(0, i + 1);
                        break;
                    }
                }
             
                return ws.indexOf(str.charAt(0)) === -1 ? str : '';
            },

            // TODO
            toCamelCase : function(str) {
                return str;
            },

            /**
             * Converts a camelCased string to a lowercase string separated by the given separator.
             * 
             * @param {String} str Camelcased string to be converted.
             * @param {String} separator[optional] Separator that will be between words. Default: '-'.
             * @return {String}
             */
            toSeparated : function(str, separator) {
                separator = separator || '-';
                
                return str.replace(/([a-z])([A-Z])/g, '$1' + separator + '$2')
                    .toLowerCase()
                    .replace(/([a-z])([0-9])/g, '$1' + separator + '$2');
            },

            /**
             * Transforms all words in the string so that they start with uppercase letter.
             * 
             * @param  {String} str String to be transformed.
             * @return {String} Transformed string.
             */
            toUpperCaseWords : function(str) {
                var words = [];
                
                $.each(str.split(' '), function(i, word) {
                    words.push(word.charAt(0).toUpperCase() + word.substr(1));
                });

                return words.join(' ');
            },

            /**
             * Changes new lines in a string to <br /> tags.
             *
             * @param {String} str String to be parsed.
             * @return {String}
             */
            nl2br : function(str) {
                return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br />' + '$2');
            },

            /**
             * Strip the string of all HTML tags.
             *
             * @param {String} str String to be parsed.
             * @return {String}
             */
            stripTags : function(str) {
                return $('<div>').html(str).text();
            },

            /**
             * Finds URL's in the string and changes them to links.
             *
             * @param {String} str String to be parsed.
             * @return {String}
             */
            parseLinks : function(str) {
                return str.replace(/((?:http|https):\/\/[a-z0-9\/\?=_#&%~\-]+(\.[a-z0-9\/\?=_#&%~;\-]+)+)|(www(\.[a-z0-9\/\?=_#&%~\-]+){2,})/gi, function(url) {
                    var link = (url.substr(0, 7) !== 'http://' && url.substr(0, 8) !== 'https://') ? 'http://' + url : url;
                    return '<a href="' + link + '" target="_blank">' + url + '</a>';
                });
            },

            /**
             * Truncates the string to a specific length.
             *
             * @param {String} str String to be truncated.
             * @param {Number} length[optional] Maximum length of the string. Default: 72.
             * @param {String} suffix[optional] String to append at the end. Default: '...'.
             * @return {String} Truncated string.
             */
            truncate : function(str, length, suffix) {
                length = length || 72;
                suffix = suffix || '...';

                if (str.length <= length) {
                    return str;
                }

                var res = str.substr(0, length);

                return res.substr(0, res.lastIndexOf(' ')) + suffix;
            },

            /**
             * Escapes HTML from the string.
             *
             * @param {String} str String to be HTML-escaped.
             * @return {String}
             */
            escapeHtml : function(str) {
                return str.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
            },

            /**
             * Unescapes HTML from the string.
             *
             * @param {String} str String to be HTML-unescaped.
             * @return {String}
             */
            unescapeHtml : function(str) {
                return str.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"');
            },

            /**
             * Inserts a string into another string at specified index and returns the new string.
             *
             * @param {String} str String to have the new string inserted.
             * @param {String} insert String to be inserted.
             * @param {Number} index Index at which to insert the string.
             * @return {String}
             */
            insertAt : function(str, insert, index) {
                return (str.substr(0, index)) + insert + (str.substr(index));
            },

            /**
             * Converts string of time format hh:mm:ss to seconds as {Number}. Reverse of $.number.secondsToTimeString().
             * Can also take '.' (dot) as a separator.
             * 
             * @param {String} str Time string to be converted.
             * @return {Number}
             */
            timeStringToSeconds : function(str) {
                var seconds = 0,
                    multipliers = [1, 60, 3600],
                    ch = (str.search(/:/gmi) === -1) ? '.' : ':',
                    times = str.split(ch).reverse();
                
                $.each(times, function(i, number) {
                    seconds = seconds + (parseInt(number, 10) * multipliers[i]);
                });
                            
                return parseInt(seconds, 10);
            },

            /**
             * Checks if a string is numeric, ie. only contains numeric characters (therefore could be easily converted to int).
             * 
             * @param  {String}  str String to check.
             * @return {Boolean}
             */
            isNumeric : function(str) {
                return !isNaN(parseInt(str, 10));
            }

        },

        /*
         * NUMBER
         */
        number : {

            /**
             * Formats the number.
             *
             * @param {Number} num Number to be formatted.
             * @param {Number} decimals[optional] How many decimal points. Default: 2.
             * @param {String} decimalPoint[optional] Decimal point. Default: '.'.
             * @param {String} thousandsSeparator[optional] Thousands separator. Default: ','.
             * @return {String}
             */
            format : function(num, decimals, decimalPoint, thousandsSeparator) {
                decimals = (decimals === undefined) ? 2 : decimals;
                decimalPoint = decimalPoint || '.';
                thousandsSeparator = thousandsSeparator || ',';

                // strip all characters but numerical ones
                num = num.toString().replace(/[^0-9+\-Ee.]/g, '');

                var n = !isFinite(+num) ? 0 : +num,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    str = '',

                    toFixedFix = function(n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + Math.round(n * k) / k;
                    };

                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                str = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

                if (str[0].length > 3) {
                    str[0] = str[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSeparator);
                }
                
                if ((str[1] || '').length < prec) {
                    str[1] = str[1] || '';
                    str[1] += new Array(prec - str[1].length + 1).join('0');
                }
                return str.join(decimalPoint);
            },

            /**
             * Changes the given bytes to a user friendly string.
             *
             * TODO: add precision level so we can show e.g. 123,56 kb (so use number format afterwards)
             *
             * @param  {Number} bytes
             * @return {String}
             */
            bytesToString : function(bytes) {
                if (isNaN(bytes)) {
                    return '';
                }

                bytes = parseInt(bytes, 10);

                if (bytes < 1024) {
                    return bytes + ' b';
                }

                var kilobytes = parseInt(bytes / 1024, 10);
                if (kilobytes <= 1024) {
                    return kilobytes + ' kb';
                }

                var megabytes = parseInt(kilobytes / 1024, 10);
                return megabytes + ' MB';
            },

            /**
             * Changes the given number of seconds to a string format hh:mm:ss.
             *
             * @param {Number} seconds Number of seconds.
             * @return {String}
             */
            secondsToTimeString : function(seconds) {
                var hours = Math.floor(seconds / (60 * 60));
                seconds = seconds - hours * 60 * 60;
                
                var minutes = Math.floor(seconds / 60);
                seconds = seconds - minutes * 60;
                
                seconds = Math.round(seconds);
                
                var timeString = hours + ':' +
                    ((minutes < 10) ? '0' : '') + minutes + ':' +
                    ((seconds < 10) ? '0' : '') + seconds;
                    
                return timeString;
            }

        }

    });

    /* ################################################################
     * JQUERY EXTENSIONS
     * ################################################################ */
    /**
     * Extend with some more custom functionality.
     */
    $.fn.extend({


        /**
         * $.quickEach() replicates the functionality of $.each() but allows 'this'
         * to be used as a jQuery object without the need to wrap it using '$(this)'.
         * The performance boost comes from internally recycling a single jQuery
         * object instead of wrapping each iteration in a brand new one.
         *
         * @see https://gist.github.com/Striker21/1352993
         * 
         * @param  {[type]} f [description]
         * @return {[type]}   [description]
         */
        quickEach : function(f) {
            var j = $([0]),
                i = -1,
                l = this.length,
                c;

            while(++i < l && (c = j[0] = this[i]) && f.call(j, i, c) !== false) {}

            return this;
        },

        /**
         * Check if the given element has the given attribute.
         * 
         * @param {String} n Name of the attribute to check.
         * @return {Boolean}
         */
        hasAttr : function(name) {
            return this.attr(name) !== undefined;
        },

        /**
         * Return an ID of the DOM element or create one if it doesn't have an ID.
         *
         * @param  {String|Boolean|null} force Force an ID by passing a String (will set ID to that string) or a {Boolean} true - will generate a random unique ID. Passing null will unset the ID. Default: true.
         * @return {jQuery|String} Either the jQuery DOM element or a string with the retrieved or generated ID.
         */
        uid : function(force) {
            force = (typeof force === undefined) ? false : force;
            var $el = $(this[0]);

            // if setting a string ID then just set it and return the original object
            if (typeof force === 'string') {
                return $el.attr('id', force);
            }

            // if setting to null then unset the id
            if (force === null) {
                return $el.attr('id', null);
            }

            // if already has an id then just return it
            if (force === false || $el.attr('id')) {
                return $el.attr('id');
            }

            // generate a unique id
            var id = '';
            while(1) {
                id = 'md-' + $.string.random(16, false);
                if ($('#' + id).length === 0) {
                    break;
                }
            }

            $el.attr('id', id);
            return id;
        },

        /**
         * Scrolls the body/document to match the top of the element.
         * 
         * @param {Number} speed [optional] Speed of the animation. Default: 200.
         * @param {Number} margin [optional] Margin from the top. Default: 0.
         * @param {Number} callback [optional] Callback.
         * @param {Boolean} forceScroll [optional] Should always be scrolled? If not then if the element is visible
         *                              (within viewport) then scrolling will not happen (callback will be called immediately).
         *                              Default: false.
         * @param {String|jQuery} scrollElement [optional] What element to scroll? Selector or jQuery DOM object. Default: 'html, body'.
         * @return {jQuery} jQuery object for chaining.
         */
        animateIntoView : function(speed, margin, callback, forceScroll, scrollElement, relativeToScrollElement) {
            speed = (speed === undefined) ? 200 : speed;
            margin = parseInt(margin, 10) || 0;
            callback = (typeof callback === 'function') ? callback : $.noop;
            forceScroll = forceScroll || false;
            relativeToScrollElement = relativeToScrollElement || false;

            var $el = $(this[0]),
                $scrollElement = scrollElement ? $(scrollElement) : $htmlAndBody;

            // break if there's no such item!
            if (!$el.length || !$scrollElement.length) {
                return this;
            }

            // check if element is inside the viewport and scrolling is not forced
            var offsetTop = scrollElement && relativeToScrollElement ? $el.offsetRelative($scrollElement).top : $el.offset().top,
                scrollTop = scrollElement && relativeToScrollElement ? $scrollElement.scrollTop() : $win.scrollTop(),
                height = scrollElement && relativeToScrollElement ? $scrollElement.height() : $win.height();

            // then don't scroll if it's already visible
            if (!forceScroll && offsetTop > scrollTop && offsetTop < (scrollTop + height)) {
                // just call the callback
                callback();
                return this;
            }

            $scrollElement.animate({
                scrollTop : offsetTop - margin
            }, speed, callback);

            return this;
        },

        /**
         * Displays all elements in the collection by applying approprate CSS. Similiar to $.show() but with customizable 'display' value.
         * Most common use: show an element that should be 'inline-block' instead of 'block' (as $.show() would do).
         * Cannot use any FX tho.
         *
         * TODO: add fading FX by using $().css('opacity', 0.0000001).fadeTo(1);
         * 
         * @param {String} display[optional] CSS 'display' value, e.g. 'inline' or 'block'. Default: 'inline-block'.
         * @return {jQuery} jQuery object for chaining.
         */
        display : function(display) {
            return this.css('display', display || 'inline-block');
        },

        /**
         * Fades out and removes the element.
         * 
         * @param {Number} speed[optional] Speed of the fade out.
         * @param {Function} callback[optional] Callback.
         * @return {jQuery} jQuery object for chaining.
         */
        fadeOutRemove : function(speed, callback) {
            speed = (speed === undefined) ? 200 : speed;
            callback = (typeof(callback) === 'function') ? callback : $.noop;

            var $el = $(this);

            $el.fadeOut(speed, function() {
                $el.remove();
                
                callback.apply($el[0]);
            });

            return this;
        },

        /**
         * Slides up and removes the element.
         * 
         * @param {Number} speed[optional] Speed of the slide up.
         * @param {Function} callback[optional] Callback.
         * @return {jQuery} jQuery object for chaining.
         */
        slideUpRemove : function(speed, callback) {
            speed = (speed === undefined) ? 200 : speed;
            callback = (typeof(callback) === 'function') ? callback : $.noop;

            var $el = $(this);

            $el.slideUp(speed, function() {
                $el.remove();
                
                callback.apply($el[0]);
            });

            return this;
        },

        /**
         * Returns the HTML of the selected element including the element's tag.
         * 
         * @return {String}
         */
        outerHtml : function() {
            var $el = $(this);
            
            // use native .outerHTML (Chrome and IE)
            if ('outerHTML' in $el[0]) {
                return $el[0].outerHTML;
            }

            // use a hack
            var content = $el.wrap('<div></div>').parent().html();
            $el.unwrap();
            return content;
        },

        /**
         * Checks if the DOM object is after the element matched by the given selector.
         * 
         * @param {String|jQuery} selector jQuery selector. Can also be a jQuery DOM object.
         * @return {Boolean}
         */
        isAfter : function(selector) {
            return this.prevAll(selector).length > 0;
        },

        /**
         * Checks if the DOM object is before the element matched by the given selector.
         * 
         * @param {String|jQuery} selector jQuery selector. Can also be a jQuery DOM object.
         * @return {Boolean}
         */
        isBefore : function(selector) {
            return this.nextAll(selector).length > 0;
        },

        /**
         * Calculates an offset relative to the given element.
         * 
         * @param  {String|jQuery} selector jQuery selector. Can also be a jQuery DOM object.
         * @return {Object}
         */
        offsetRelative : function(selector) {
            var $relativeEl = $(selector),
                relativeEl = $relativeEl.get(0),
                relativeOffset = relativeEl === document.documentElement || relativeEl === document.body
                    ? {
                        top: 0,
                        left : 0
                    } : $relativeEl.offset(),
                offset = $(this).offset();

            return {
                top : offset.top - relativeOffset.top,
                left : offset.left - relativeOffset.left
            };
        }

    });

})(jQuery, window, document, Math);