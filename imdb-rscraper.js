var jsdom = require('jsdom');

var parseOptions = {
  mainSite: 'http://www.imdb.com',
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

module.exports.imdbrscraper = function(site, jquery, cb) {
  function parse(site, jquery, callback) {
    jsdom.env({
      html: site,
      src: [ jquery],
      done: function(err, window) {
        callback(window.$, err);
      }
    });    
  };

  function movieData(imdbAddress) {
    parse(imdbAddress, jquery, function($, err) {
      var result = {};
      parseOptions.elements.forEach(function(elem) {
        result[elem.name] = elem.sel($);
      });
      cb(result, err);
    });    
  }

  if (site.search("^http://") === 0) {
    // Site is given make direct parsing
    movieData(site);
  } else {
    // We need to make extra query to get the web page
    var searchSite = parseOptions.mainSite + '/find?q=' + encodeURIComponent(site);
    parse(searchSite, jquery, function($, err) {
      var partOf = $('td a[href^="/title"]:first').attr('href')
        , result = {};
      movieData(parseOptions.mainSite + partOf);
    });    
  }
}