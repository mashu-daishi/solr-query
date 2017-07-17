'use strict';

let defaultConfig = require( '../config' ).defaultOptions;

function Client( config ) {
	this.config = {
		'host'     : config && config.host || defaultConfig.host,
		'port'     : config && config.port || defaultConfig.port,
		'core'     : config && config.core || defaultConfig.core,
		'protocol' : config && config.protocol || defaultConfig.protocol,
		'rootPath' : config && config.rootPath || defaultConfig.rootPath
	};
};

require( './methods' )( Client );

module.exports = Client;
