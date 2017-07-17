'use strict';

const Client        = require( process.cwd() + '/index.js' );
const defaultConfig = require( process.cwd() + '/config' ).defaultOptions;

require( 'should' );

describe( 'set config', () => {
	let solrClient, options;

	options = {
		'host' : 'solr',
		'core' : 'edivatelibrary'
	};

	before( () => {
		solrClient = new Client( options );
	} );

	it( 'should populate new options', () => {
		solrClient.should.have.property( 'config' ).and.be.an.Object;

		solrClient.config.should.have.property( 'host' ).and.equal( options.host );
		solrClient.config.should.have.property( 'core' ).and.equal( options.core );
	} );

	it( 'should populate default options', () => {
		solrClient.should.have.property( 'config' ).and.be.an.Object;

		solrClient.config.should.have.property( 'port' ).and.equal( defaultConfig.port );
		solrClient.config.should.have.property( 'protocol' ).and.equal( defaultConfig.protocol );
		solrClient.config.should.have.property( 'rootPath' ).and.equal( defaultConfig.rootPath );
	} );
} );
