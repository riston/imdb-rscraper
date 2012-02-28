## What this scraper does ?
Parse the content from given IMDB site and then returns data in JSON format. Currently it does not support much of content which can be taken from IMDB.

## How to use
JQuery should pass in as string,

```javascript
var fs = require('fs')
  , imdb = require('../imdb-rscraper').imdbrscraper
  , jquery = fs.readFileSync('./jquery.min.js').toString();

imdb('http://www.imdb.com/title/tt0348836/', jquery, function(resultData) { 
	console.log(resultData); 
});
```

Also now there is support for searching movie from imdb so you don't have to give
direct link. The downside of this kind query is that it makes extra request so it's a bit slower.

```javascript
imdb('the ring', jquery, function(resultData) { 
	console.log(resultData); 
});
```