var fs = require('fs')
  , imdb = require('../imdb-rscraper').imdbrscraper
  , jquery = fs.readFileSync('./jquery.min.js').toString();

imdb('http://www.imdb.com/title/tt0348836/', jquery, function(resultData) { 
	console.log(resultData); 
});

imdb('fast and furious', jquery, function(resultData) { 
	console.log(resultData); 
});