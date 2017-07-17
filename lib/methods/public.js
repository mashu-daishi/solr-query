'use strict';

module.exports = Client => {
	Client.prototype.search = function( query, options ) {
		return this._runQuery( query, options );
	};
};
