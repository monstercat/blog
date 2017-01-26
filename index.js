var Metalsmith  = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var jsonapi     = require('./json-api');
var path        = require('path');

function slug(str, opts){
  opts = opts || {};
  return str.toLowerCase()
    .replace(opts.replace || /[^a-z0-9]/g, ' ')
    .replace(/^ +| +$/g, '')
    .replace(/ +/g, opts.separator || '-')
};

function makeKey(obj) {
  return path.join(path.dirname(obj.path), slug(obj.title) + '.md')
}

Metalsmith(__dirname)
  .use(function (files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      var name = path.basename(file);
      if (name.indexOf(".") == 0) {
        delete files[file];
      }
    });
    done();
  })
  .use(collections({
    posts:{
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(function (files, metalsmith, done) {
    var keys = Object.keys(files);
    var map = {}
    for (var i=0; i<keys.length; i++) {
      var key = keys[i];
      var obj = files[key];
      var nkey = makeKey(obj);
      obj.path = nkey;
      map[nkey] = obj;
      delete files[key];
    }
    Object.keys(map).forEach((key)=> {
      files[key] = map[key];
    });
    done();
  })
  .use(jsonapi())
  .destination('./build')
  .build(function(err) {if(err) console.log(err)});
