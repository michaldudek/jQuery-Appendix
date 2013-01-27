var bundy = require('bundy');

bundy.js('src/jquery.appendix.js', 'minified/jquery.appendix.min.js');
bundy.js([
	'src/jquery.appendix.js',
	'src/jquery.appendix.prototypes.js'
], 'minified/jquery.appendix.p.min.js');

bundy.build();