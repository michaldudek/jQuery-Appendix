var bundy = require('bundy');

bundy.js('src/jquery.appendix.js', 'jquery.appendix.min.js');
bundy.js([
	'src/jquery.appendix.js',
	'src/jquery.appendix.prototypes.js'
], 'jquery.appendix.proto.min.js');

bundy.build();