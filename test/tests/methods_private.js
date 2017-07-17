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
		solrClient._assembleHostUrl.should.be.a.Function;
		solrClient._assemblePathUrl.should.be.a.Function;
		solrClient._makeRequest.should.be.a.Function;
		solrClient._runQuery.should.be.a.Function;
	} );
} );
