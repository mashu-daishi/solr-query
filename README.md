# solr-query

This project is an attempt at making Solr searches a little easier. I'm sure I'm not the only person that's struggled with trying to build a correct query string for Solr.

### Notes

This is an in-progress project. For now, only Solr /search is supported.

## Installing

```
npm install solr-query
```

```js
const Client = require( 'solr-query' );

const solrC = new Client();

solrC.search( searchQuery, searchOptions );
```

## Methods

### Solr Configuration

When spawning a new Client object, you may pass in options to connect to your instance of Solr. The optional parameters are listed in the [config folder](https://github.com/mashu-daishi/solr-query).

### .search( searchQuery, searchOptions )
##### searchQuery

This will accept a variety of options. It can be a string, an array, or an object. There are a combination of possibilities with Objects. If your search query is: ```q=Money AND (USD OR GBP)```, you can pass an object of:
```js
searchQuery = {
    '$and' : [ 'Money', { '$or' : [ 'USD', 'GBP' ] } ]
}
```

##### searchOptions

```options.logging( function );```
( You may pass in any function, or ```console.log``` to print to console.)
This will output the ```request``` object that will be sent. It should allow you to see the ```URL```, ```Method```, and ```qs``` parameters.

```options.commonParams```
This is where you would pass in any solr-specific query parameters that do not need formatted.

For example:
```?qf=contents&limit=100```
would be passed as
```js
options.commonParams = {
    'qf'    : 'contents',
    'limit' : 100
};
```
Please note, if you pass a `q` parameter into this, it **will** override the `searchQuery` that is passed in.

## Running the tests

```
npm test
```

## Authors

* **Matthew Young** - *Initial work* - [mashu-daishi](https://github.com/mashu-daishi)
