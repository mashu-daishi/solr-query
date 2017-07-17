'use strict';

const Client        = require( process.cwd() + '/index.js' );
const defaultConfig = require( process.cwd() + '/config' ).defaultOptions;

require( 'should' );

describe( 'private methods', () => {
	let solrClient, options;

	before( () => {
		solrClient = new Client();
	} );

	it( 'should have correct methods', () => {
		solrClient.search.should.be.a.Function;
	} );
} );
