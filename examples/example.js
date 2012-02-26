var imdb = require('../imdb-rscraper').imdbrscraper;

imdb('http://www.imdb.com/title/tt0348836/', function(resultData) { 
	console.log(resultData); 
});