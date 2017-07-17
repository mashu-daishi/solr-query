'use strict';

module.exports = Client => {
	require( './private' )( Client );
	require( './public' )( Client );
};
