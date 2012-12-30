<?php
require_once 'bin/Packager.php';

$jsSuccess = Packager::js(array(
	'src/jquery.appendix.js',
	'src/jquery.appendix.prototypes.js'
), 'jquery.appendix.min.js');