(function() {
  'use strict';

  var fs = require('fs'),
    util = require('util'),
    mime = require('mime'),
    async = require('async');
  var compresslib = require('./lib');

  var compress = {
    debug: true,

    ASYNC_LIMIT: 100,

    init: function(files, callback) {
      if (!util.isArray(files) || files.length < 1) {
        return callback(new Error('Nothing to do'));
      }
      util.log('compress: total files to process: ' + files.length);
      async.forEachLimit(files, compress.ASYNC_LIMIT, compress.resize, function(err) {
        if (!err) {
          util.log('Total files processed: ' + files.length);
        }
        callback(err);
      });
    },

    isImage: function(file) {
      return fs.existsSync(file) && mime.lookup(file).indexOf('image') > -1
    },

    resize: function(file, callback) {
      async.nextTick(function() {
        if (compress.isImage(file)) {
          var data = {
            source: file,
            target: file
          };
          compresslib.resize(data, function(err, res) {
            if (!err) {
              compress.log('Processed: ' + res);
            }
            callback(err);
          });
        } else {
          callback(new Error('File not found or is invalid format: ' + file));
        }
      });
    },

    log: function(data) {
      if (compress.debug) {
        util.log(data);
      }
    }
  };

  module.exports = compress;

  if (require.main === module) {
    (function() {
      var logcb = function(err, res) {
        console.log(err || res);
      }
      process.argv.shift();
      process.argv.shift();
      compress.init(process.argv, logcb);
    })();
  }
})();
