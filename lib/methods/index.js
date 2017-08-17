'use strict';

const _       = require( 'lodash' );
const request = require( 'request' );

function _assembleQ( query, option ) {
	let returnQ = '*';

	if ( _.isString( query ) ) {
		returnQ = query;
	} else if ( _.isArray( query ) ) {
		let qArray    = [];
		let delimiter = ' ';

		query.forEach( function ( subItem ) {
			qArray.push( _assembleQ( subItem ) );
		} );

		if ( option && option.delimiter ) {
			delimiter = option.delimiter;
		}

		returnQ = `(${qArray.join( ')' + delimiter + '(' )})`;
	} else if ( _.isObject( query ) ) {
		Object.keys( query ).forEach( function ( key ) {
			let delimiter = ' ';
			let qf = '';

			if ( key === '$or' ) {
				delimiter = ' OR ';
			} else if ( key === '$and' ) {
				delimiter = ' AND ';
			} else {
				qf = `${ key }:`;
			}

			returnQ = `${ qf }${ _assembleQ( query[ key ], { delimiter } ) }`;
		} );
	} else if ( _.isBoolean( query ) ) {
		returnQ = String( query );
	}

	return returnQ;
}

const prepRequest = ( url, method, qs, options ) => {
	let requestParams = {
		url, method, qs,
		'useQuerystring' : true
	};

	if ( options ) {
		if ( options.logging ) {
			let tempRequestParams = _.cloneDeep( requestParams );

			delete tempRequestParams.useQuerystring;

			options.logging( tempRequestParams );
		}

		if ( options.update ) {
			requestParams.json = true;
			requestParams.body = _.cloneDeep( qs );

			delete requestParams.useQuerystring;
			delete requestParams.qs;
		}
	}

	return requestParams;
};

function _assembleHostUrl( protocol, host, port ) {
	return `${ protocol }://${ host }:${ port }`;
};

function _assemblePathUrl( rootPath, core, destination ) {
	return `/${ rootPath }/${ core }/${ destination || 'query' }?commit=true`;
};

function _makeRequest( requestParams ) {
	return new Promise( ( resolve, reject ) => {
		request( requestParams, function ( requestError, response, body ) {
			if ( requestError ) {
				return reject( requestError );
			}

			try {
				let tempObj = body;

				if ( !requestParams.body ) {
					tempObj = JSON.parse( body );
				}

				if ( tempObj.error ) {
					return reject( tempObj.error );
				}

				resolve( tempObj );
			} catch ( caughtError ) {
				if ( body && body.indexOf( '<lst name="error">' ) > -1 ) {
					let tempMessage = body.split( '<lst name="error"><str name="msg">' )[ 1 ];
					let tempCode    = tempMessage.split( '</str><int name="code">' );
					let solrError   = {
						'message' : _.clone( tempCode[ 0 ] ),
						'code'    : _.clone( tempCode[ 1 ].split( '</int></lst>' )[ 0 ] )
					};

					caughtError = { caughtError, solrError };
				}

				reject( caughtError );
			}
		} );
	} );
};

function _runQuery( that, query, options ) {
	return new Promise( ( resolve, reject ) => {
		try {
			let qs = {
				'q' : _assembleQ( query )
			};

			let baseUrl = _assembleHostUrl( that.config.protocol, that.config.host, that.config.port );
			baseUrl += _assemblePathUrl( that.config.rootPath, that.config.core );

			if ( options && options.commonParams ) {
				if ( !_.isObject( options.commonParams ) ) {
					throw ( '`commonParams` must be an Object' );
				}

				Object.keys( options.commonParams ).forEach( function ( param ) {
					qs[ param ] = options.commonParams[ param ];
				} );
			}

			return _makeRequest( prepRequest( baseUrl, 'GET', qs, options ) ).then( results => {
				resolve( results );
			} ).catch( reject );
		} catch( e ) {
			return reject( e );
		}
	} );
};

function _saveQuery( that, obj, options ) {
	return new Promise( ( resolve, reject ) => {
		try {
			let cleanObj = _.clone( obj );

			let baseUrl = _assembleHostUrl( that.config.protocol, that.config.host, that.config.port );
			baseUrl += _assemblePathUrl( that.config.rootPath, that.config.core, 'update/json' );

			return _makeRequest( prepRequest( baseUrl, 'POST', [ cleanObj ], { 'update' : true } ) ).then( results => {
				resolve( results );
			} ).catch( reject );
		} catch( e ) {
			return reject( e );
		}
	} );
};

module.exports = { _saveQuery, _runQuery };
