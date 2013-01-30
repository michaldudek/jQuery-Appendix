/*global jQuery, module, test, equal, strictEqual, deepEqual, ok, expect*/
(function($, undefined) {
	//"use strict"; // better not to use strict mode for the tests

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

	module('Array Methods');
	test('$.array.unique()', function() {
		deepEqual($.array.unique(['a', 'b', 'c', 'c', 'a', 'd']), ['a', 'b', 'c', 'd'], 'Removes repeating items');
		deepEqual($.array.unique([1, 2, 3, 0, '0', '1', '2', '3', '4', '5', 0, 1, 2, 3, 4]), [1, 2, 3, 0, '0', '1', '2', '3', '4', '5', 4], 'Takes types into account');
	});

	module('Array Prototype Methods');
	test('Array prototype', function() {
		expect(0);
	});

	module('String Methods');
	test('$.string.parseVariables()', function() {
		equal($.string.parseVariables('Lorem ipsum {$key}', {
			key : 'dolor'
		}), 'Lorem ipsum dolor', 'Replaces a variable with $ sign.');
		equal($.string.parseVariables('Lorem ipsum {key}', {
			key : 'dolor'
		}), 'Lorem ipsum dolor', 'Replaces a variable without $ sign.');
		equal($.string.parseVariables('Lorem ipsum {$key}'), 'Lorem ipsum ', 'Removes a variable with $ sign if no value is passed.');
		equal($.string.parseVariables('Lorem ipsum {$key}', {
			key : null
		}), 'Lorem ipsum ', 'Replaces a variable with $ sign even if the value is null.');
		equal($.string.parseVariables('Lorem ipsum {key}', {
			key : null
		}), 'Lorem ipsum ', 'Replaces a variable without $ sign even if the value is null.');
		equal($.string.parseVariables('Lorem ipsum {key} sit {key2}', {
			key : 'dolor',
			key2 : 'amet'
		}), 'Lorem ipsum dolor sit amet', 'Replaces multiple variables.');
		equal($.string.parseVariables('Lorem ipsum {key} sit {key} adipiscit {key2}', {
			key : 'dolor',
			key2 : 'elit'
		}), 'Lorem ipsum dolor sit dolor adipiscit elit', 'Replaces a variable multiple times.');
		equal($.string.parseVariables('Nothing to replace here', {
			replace : 'add'
		}), 'Nothing to replace here', 'Ignores any additional variables');
		equal($.string.parseVariables('{this} will not be replaced', {
			that : 'no place for me'
		}), '{this} will not be replaced', 'Leaves variables without $ sign in place if they have no values.');
		strictEqual($.string.parseVariables('{$key}', {
			key : 1
		}), '1', 'Returns a string even if it could be interpreted as number.')
	});
	test('$.string.random()', function() {
		equal($.string.random().length, 16, 'Returns 16 characters by default');
		equal($.string.random(12).length, 12, 'Returns the specified amount of characters');

		var lc = $.string.random();
		equal(lc.toLowerCase(), lc, 'Returns lowercase strings by default');

		var lowercaseNoPunctuationTest = /^([a-z0-9]+)$/;

		for (var i = 0; i <= 1000; i++) {
			strictEqual(lowercaseNoPunctuationTest.test($.string.random(8, false, false)), true, 'Passing false as 2nd and 3rd argument always returns lowercase string');
		}
	});
	test('$.string.trim()', function() {
		equal($.string.trim('    Some string    '), 'Some string', 'Properly trims whitespace from beginning and end.');
		equal($.string.trim('  Some    string '), 'Some    string', 'Does not remove whitespace from inside of the string.');
		equal($.string.trim('###removethese#', '#'), 'removethese', 'Trims other specified character.');
		equal($.string.trim('## removethese ###', '#'), ' removethese ', 'Only trims the specified special character and not whitespace');
		equal($.string.trim(' #  ## remove these ## ', '#'), ' #  ## remove these ## ', 'Does not trim the special character if it is not at char 0 or last.');
		equal($.string.trim('#%#--%lorem ipsum  #**{}', '#%-*{}'), 'lorem ipsum  ', 'Removes multiple defined special characters.');
		equal($.string.trim('^\\s/([a-z]+)$', '^\\/[-]+$'), 's/([a-z]+)', 'Does not get confused with special characters');
	});
	test('$.string.toCamelCase()', function() {
		equal($.string.toCamelCase('thisIsCamelCase1'), 'thisIsCamelCase1', 'Leaves camel case intact.');
		equal($.string.toCamelCase('this_is_not_a_camel_case'), 'thisIsNotACamelCase', 'Transforms string separated by underscores to camelCase');
		equal($.string.toCamelCase('this is not a camel case'), 'thisIsNotACamelCase', 'Transforms string separated by space to camelCase');
		equal($.string.toCamelCase('this-is-not-a-camel-case'), 'thisIsNotACamelCase', 'Transforms string separated by dash to camelCase');
		equal($.string.toCamelCase('this.is.not.a.camel.case'), 'thisIsNotACamelCase', 'Transforms string separated by dot to camelCase');
		equal($.string.toCamelCase('this_is_a-mixed-string of doom'), 'thisIsAMixedStringOfDoom', 'Transforms string separated by various separators to camelCase');
		equal($.string.toCamelCase('this_is__multiple_linesWithCC'), 'thisIsMultipleLinesWithCC', 'Transforms string separated by repeating separators to camelCase');
	});
	test('$.string.toSeparated()', function() {
		equal($.string.toSeparated('thisIsCamelCase1'), 'this-is-camel-case-1', 'By default transforms a camel case string to dash separated string.');
		equal($.string.toSeparated('this-is-not-a-camel-case'), 'this-is-not-a-camel-case', 'Leaves not camel case string intact');
		equal($.string.toSeparated('this_is_not_a_camel_case'), 'this_is_not_a_camel_case', 'Leaves not camel case string separated by not default separator intact');
		equal($.string.toSeparated('this is also not a camel case'), 'this is also not a camel case', 'Leaves normal text strings intact');
		equal($.string.toSeparated('this is camelCasedString'), 'this is camel-cased-string', 'Transforms a camel cased string even if it is only a part of a bigger string');
		equal($.string.toSeparated('handle1NumberAnd2numbers'), 'handle-1-number-and-2numbers', 'Properly handles numbers and lowercase strings after numbers');
		equal($.string.toSeparated('thisIsCamelCase1', '_'), 'this_is_camel_case_1', 'Takes a separator as 2nd argument');
	});
	test('$.string.toUpperCaseWords()', function() {
		equal($.string.toUpperCaseWords('this is all lowercase'), 'This Is All Lowercase', 'Transforms first characters of words to uppercase.');
		equal($.string.toUpperCaseWords('this is all lowercase with 123number'), 'This Is All Lowercase With 123number', 'When a number is first char of a word - leaves it intact.');
		equal($.string.toUpperCaseWords('this-is-all-lowercase-but-separated-by dash'), 'this-is-all-lowercase-but-separated-by Dash', 'Only takes space into account as separator of words');
		equal($.string.toUpperCaseWords('somewhere here  is a  white   space'), 'Somewhere Here  Is A  White   Space', 'Does not remove whitespace.');
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
	test('String prototype', function() {
		expect(0); // dunno what to test here

		// proto functions return the same values as appendix functions
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
	test('Number prototype', function() {
		expect(0); // dunno what to test here

		// proto functions return the same values as appendix functions
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