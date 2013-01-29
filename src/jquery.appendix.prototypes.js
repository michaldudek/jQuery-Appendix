/*! jQuery Appendix - v0.8.1
* A small set of functions appended to jQuery that make your life even easier.
*
* https://github.com/michaldudek/jQuery-Appendix
*
* This optional file merges some of the added functions into object prototypes.
*
* Copyright (c) 2013 Michał Dudek, http://www.michaldudek.pl, michal@michaldudek.pl
* MIT License, https://github.com/michaldudek/jQuery-Appendix/blob/master/LICENSE.md
*/

/*global jQuery*/
(function($, window, undefined) {
	"use strict";

	$.each(['String', 'Array', 'Number'], function(i, type) {
		$.extend(window[type].prototype, $[type.toLowerCase()]);
	});

})(jQuery, window);