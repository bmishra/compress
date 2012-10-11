(function() {
  'use strict';

  var fs = require('fs'),
    util = require('util'),
    magickwand = require('magickwand');

  var libs = {
    resize: function(data, callback) {
      var err = null;
      var options = {};
      if (!data.width && !data.height) {
        options.quality = 80; /* compress full size images */
      } else {
        options.width = Number(data.width);
        options.height = Number(data.height);
      }
      var performAction = 'thumbnail' === data.action ? magickwand.thumbnail : magickwand.resize;
      performAction(data.source, options, function(err, imagedata) {
        if (!err && imagedata) {
          fs.writeFile(data.target, imagedata, function(err) {
            callback(err, data.target);
          });
        } else {
          callback(err || new Error('Unable to process request: ' + data));
        }
      });
    }
  };

  module.exports = libs;
})();
