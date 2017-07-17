'use strict';

const del      = require( 'del' );
const gulp     = require( 'gulp' );
const istanbul = require( 'gulp-istanbul' );
const mocha    = require( 'gulp-mocha' );

let paths = {
	'cover' : [

		// Include everything to be covered
		'lib/**/*.js',

		// Exclude directories that are not code
		'!instrumented/**',
		'!node_modules/**',
		'!test/**',
		'!index.js'
	],

	'test'     : [ 'test/tests/**/*.js' ],
	'coverage' : 'instrumented'
};

gulp.task( 'clean-coverage', function () {
	del( [ paths.coverage ] );
} );

gulp.task( 'test', [ 'clean-coverage' ], function () {
	let mochaOptions = {
		'ui'       : 'bdd',
		'reporter' : 'spec',
		'timeout'  : 5000
	};

	return gulp.src( paths.cover )
		.pipe( istanbul( { 'includeUntested' : true } ) )
		.pipe( istanbul.hookRequire() )

		.on( 'finish', function () {
			gulp.src( paths.test, { 'read' : false } )

				.pipe(
					mocha( mochaOptions )
						.on( 'error', function ( error ) {
							process.exit( 1 );
						}
				) )

				.on( 'error', function () {
					process.exit( 1 );
				} )
		} );
} );
