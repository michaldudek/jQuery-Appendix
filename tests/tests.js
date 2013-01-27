/*global jQuery, module, test, equal, strictEqual, ok*/
(function($, undefined) {
	//"use strict"; // better not to use strict mode for tests ;)

	/* TEST OBJECT METHODS */
	module('Object Methods');
	test('$.object.size()', function() {
		strictEqual($.object.size({}), 0, 'Empty object returns 0');
		strictEqual($.object.size({'key':'value'}), 1, 'Object with 1 key returns 1');
		strictEqual($.object.size({'key1':'value','key2':'value','key3':'value','key4':'value'}), 4, 'Object with 4 keys returns 4');
		strictEqual($.object.size({'key1':'value','key2':'value','key3':'value','key3':'value'}), 3, 'Object with repeating keys returns the amount of unique keys');
		strictEqual($.object.size({0:'nil',1:'what','2':'value'}), 3, 'Object with mixed keys returns proper number');
		strictEqual($.object.size({'null':null}), 1, 'Object with null value counts that value anyway');

		var Plugin = function() {
			this.key1 = 'value';
			this.key2 = 'value2';
		};

		Plugin.prototype = {
			key3 : 'other value',
			key4 : 'another'
		};

		strictEqual($.object.size(new Plugin()), 2, 'Instantiated object only takes own properties into account');
	});

	module('Object Prototype Methods');
	test('Object prototype', function() {
		// TODO
	});

	module('Array Methods');
	test('$.array.unique()', function() {
		equal($.array.unique(['a', 'b', 'c', 'c', 'a', 'd']), ['a', 'b', 'c', 'd'], 'Removes repeating items');
	});

	module('Array Prototype Methods');
	test('Object prototype', function() {
		// TODO
	});

	module('String Methods');
	test('$.string.parseVariables()', function() {
		// TODO
	});
	test('$.string.random()', function() {
		// TODO
	});
	test('$.string.trim()', function() {
		// TODO
	});
	test('$.string.toCamelCase()', function() {
		// TODO
	});
	test('$.string.toSeparated()', function() {
		// TODO
	});
	test('$.string.toUpperCaseWords()', function() {
		// TODO
	});
	test('$.string.nl2br()', function() {
		// TODO
	});
	test('$.string.stripTags()', function() {
		// TODO
	});
	test('$.string.parseLinks()', function() {
		// TODO
	});
	test('$.string.truncate()', function() {
		// TODO
	});
	test('$.string.escapeHtml()', function() {
		// TODO
	});
	test('$.string.unescapeHtml()', function() {
		// TODO
	});
	test('$.string.insertAt()', function() {
		// TODO
	});
	test('$.string.timeStringToSeconds()', function() {
		// TODO
	});

	module('String Prototype Methods');
	test('Object prototype', function() {
		// TODO
	});

	module('Number Methods');
	test('$.number.format()', function() {
		// TODO
	});
	test('$.number.bytesToString()', function() {
		// TODO
	});
	test('$.number.secondsToTimeString()', function() {
		// TODO
	});

	module('Number Prototype Methods');
	test('Object prototype', function() {
		// TODO
	});

	/* TEST jQUERY EXTENSIONS */
	module('jQuery Extensions');
	test('$().hasAttr()', function() {
		// TODO
	});
	test('$().uid()', function() {

		equal($('#have-an-id').uid(), 'have-an-id', 'Reads an ID');
		equal($('#id-tests p').uid(), $('#id-tests p').attr('id'), 'Returns the same what attr(id) on empty ID');

		equal($('#id-tests p').uid('force-id').attr('id'), 'force-id', 'Sets an ID');
		equal($('#id-tests p').uid(), 'force-id', 'Reads a previously set ID');

		equal($('#id-tests span').uid(true), $('#id-tests span').attr('id'), 'Upon forcing an ID returns that ID');
		equal($('#have-an-id').uid(true), 'have-an-id', 'Forcing an ID returns the ID and does not change existing one');
		equal($('#id-tests p').uid(true), 'force-id', 'Forcing an ID returns the previously set ID and does not change existing one');
		$('#id-tests span').attr('id', '');
		equal($('#id-tests span').uid(false), '', 'Passing false does not force ID generation');

		strictEqual($('#id-tests p').uid(null).attr('id'), undefined, 'Setting ID to null unsets the ID');

		var $unsetId = $('#have-an-id');
		$unsetId.uid(null);
		ok(!$unsetId.attr('id'), 'Unsetting an ID really removes it');

		var uids = [];
		for(var i = 0; i <= 16557; i++) {
			uids.push($('<div />').appendTo('#loads-to-generate').uid(true));
		}
		equal($('#loads-to-generate').children().length, $.array.unique(uids).length);
	});
	test('$().outerHtml()', function() {
		// TODO
	});
	test('$().isAfter()', function() {
		// TODO
	});
	test('$().isBefore()', function() {
		// TODO
	});

})(jQuery);