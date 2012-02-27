var jsdom = require('jsdom')
  , fs = require('fs');

var jquery = fs.readFileSync('./jquery.min.js').toString();
//site: 'http://www.imdb.com/title/tt0348836/'
var parse = {
  elements: [
    { 
      name: 'name', 
      sel: function($) {
        return $('title').text().match(/[^-]+/)[0].trim();
      }
    },
    {
      name: 'rating',
      sel: function($) {
        return $('.star-box-giga-star').text().trim();
      }
    },
    {
      name: 'genre',
      sel: function($) {
        var genres = $('.see-more a[itemprop="genre"]').map(function() {
          return $(this).text();
        }).get();
        return genres;
      }
    },
    {
      name: 'duration',
      sel: function($) {
        return $('time[itemprop="duration"]').text();
      }
    },
    {
      name: 'release',
      sel: function($) {
        return $('time[itemprop="datePublished"]').text();
      }
    },
    {
      name: 'cast',
      sel: function($) {
        var castList = $('.cast_list tr:gt(0)')
          , result = [];

        castList.each(function(index) {
          var char = $(this).find('.character a');
          result.push({
            name: $(this).find('.name a').text(),
            character: (char.text() === '') ? 
              $.trim($(this).find('.character div').text().replace('/\n/g', '')) : 
              char.text()
          });
        });
        return result;
      }
    },
    {
      name: 'media',
      sel: function($) {
        var matches = $('.mediastrip a img')
          , result = [];
        matches.each(function(index) {
          result.push({
            title: $(this).attr('title'),
            alt: $(this).attr('alt'),
            src: $(this).attr('src'),
          });
        });
        return result;
      }
    }
  ]
};

module.exports.imdbrscraper = function(site, cb) {
  jsdom.env({
    html: site,
    src: [ jquery],
    done: function(err, window) {
      var $ = window.$, result = {};

      parse.elements.forEach(function(elem) {
        result[elem.name] = elem.sel($);
     });
     
     cb(result);
    }
  });
}