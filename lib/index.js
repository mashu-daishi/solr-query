'use strict';

const defaultConfig = require( '../config' ).defaultOptions;
const methods       = require( './methods' );

function Client( config ) {
	this.config = {
		'host'     : config && config.host || defaultConfig.host,
		'port'     : config && config.port || defaultConfig.port,
		'core'     : config && config.core || defaultConfig.core,
		'protocol' : config && config.protocol || defaultConfig.protocol,
		'rootPath' : config && config.rootPath || defaultConfig.rootPath
	};

	this.search = function( query, options ) {
		return methods._runQuery( this, query, options );
	};

	this.save = function( obj, options ) {
		return methods._saveQuery( this, obj, options );
	};
};


module.exports = Client;
