/*global jQuery*/
(function($, undefined) {
	"use strict";

	/* TEST jQUERY EXTENSIONS */
	module('jQuery Extensions');
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

		// few thousand unique
	});

})(jQuery);