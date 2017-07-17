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

module.exports = Client => {
	Client.prototype._assembleHostUrl = function( protocol, host, port ) {
		return `${ protocol }://${ host }:${ port }`;
	};

	Client.prototype._assemblePathUrl = function( rootPath, core ) {
		return `/${ rootPath }/${ core }/query`;
	};

	Client.prototype._makeRequest = function( url, method, qs, options ) {
		return new Promise( ( resolve, reject ) => {
			let requestParams = {
				url, method, qs,
				'useQuerystring' : true
			};

			if ( options && options.logging ) {
				let tempRequestParams = _.cloneDeep( requestParams );

				delete tempRequestParams.useQuerystring;

				options.logging( tempRequestParams );
			}

			request( requestParams, function ( requestError, response, body ) {
				if ( requestError ) {
					return callback( requestError );
				}

				try {
					let tempObj = JSON.parse( body );

					if ( tempObj.error ) {
						return reject( tempObj.error );
					}

					resolve( tempObj );
				} catch ( caughtError ) {
					reject( caughtError );
				}
			} );
		} );
	};

	Client.prototype._runQuery = function( query, options ) {
		return new Promise( ( resolve, reject ) => {
			try {
				let qs = {
					'q' : _assembleQ( query )
				};

				let baseUrl = this._assembleHostUrl( this.config.protocol, this.config.host, this.config.port );
				baseUrl += this._assemblePathUrl( this.config.rootPath, this.config.core );

				if ( options && options.commonParams ) {
					if ( !_.isObject( options.commonParams ) ) {
						throw ( '`commonParams` must be an Object' );
					}

					Object.keys( options.commonParams ).forEach( function ( param ) {
						qs[ param ] = options.commonParams[ param ];
					} );
				}

				return this._makeRequest( baseUrl, 'GET', qs, options ).then( results => {
					resolve( results );
				} ).catch( reject );
			} catch( e ) {
				return reject( e );
			}
		} );
	};
};
