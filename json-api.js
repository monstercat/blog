var fs = require('fs');
var path = require('path');

var excerptRE = /^[^\*\#\<\-]/;
function getExcerpt(post) {
  var str = String(post.contents);
  var arr = str.split("\n");
  for (var i=0; i<arr.length; i++) {
    var el = (arr[i] || "").trim();
    if (!el) continue;
    if (excerptRE.test(el)) return el; 
  }
  return "";
}

function getTags(post) {
  return post.tags.split(",")
    .map((str)=> str.trim())
    .filter((str)=> !!str);
}

function mapPost(post) {
  var obj = {};
  obj.title   = post.title;
  obj.date    = new Date(post.date);
  obj.author  = post.author;
  obj.subline = post.subline;
  obj.image   = post.image;
  obj.path    = post.path;
  obj.excerpt = getExcerpt(post) || post.excerpt;
  obj.tags    = getTags(post);
  return obj;
}

function sortPost(a, b) {
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  return 0;
}

function buildTagMap(arr) {
  var map = {};
  for (var i=0;i<arr.length;i++) {
    var post = arr[i];
    for (var n=0;n<post.tags.length;n++) {
      var tag = post.tags[n];
      if (!map[tag]) map[tag] = [];
      map[tag].push(post);
    }
  }
  return map;
}

function add(files, path, obj) {
  files[path] = {
    contents: new Buffer(JSON.stringify(obj), 'utf8')
  }
}

module.exports = function(opts){
  if (typeof opts != 'object') opts = {};
  var filepath = opts.filepath || './json/';
  var perpage  = opts.perpage || 7;
  return function(files, metalsmith, done){
    setImmediate(done);
    var arr = Object.keys(files).map((file)=> files[file]).map(mapPost).sort(sortPost);
    var tagmap = buildTagMap(arr);
    var pages = Math.ceil(arr.length / perpage);
    for (var i=0; i<arr.length; i++) {
      var obj = arr[i]
      var opath = path.join(path.dirname(obj.path), path.basename(obj.path, path.extname(obj.path)) + '.json')
      add(files, path.join(filepath, opath), obj);
    }
    for (var i=0; i<pages; i++) {
      var page = i + 1
      var items = arr.slice(perpage * i, (perpage * i) + perpage)
      var obj = {
        page: page,
        pages: pages,
        count: items.length,
        limit: perpage,
        total: arr.length,
        results: items
      }
      add(files, path.join(filepath, 'archive', 'pages', page+'.json'), obj);
    }
    add(files, path.join(filepath, 'archive', 'index.json'), {
      pages: pages,
      limit: perpage,
      total: arr.length
    });
    add(files, path.join(filepath, 'tags', 'index.json'), Object.keys(tagmap));
    var tags = Object.keys(tagmap);
    for (var i=0; i<tags.length; i++) {
      var tag = tags[i];
      var tarr = tagmap[tag];
      var tpages = Math.ceil(tarr.length / perpage);
      for (var n=0; n<tpages; n++) {
        var items = tarr.slice(perpage * n, (perpage * n) + perpage)
        var page = n + 1;
        var obj = {
          tag: tag,
          page: page,
          pages: tpages,
          count: items.length,
          limit: perpage,
          total: tarr.length,
          results: items
        };
        add(files, path.join(filepath, 'tags', tag, 'pages', page+'.json'), obj);
      }
      add(files, path.join(filepath, 'tags', tag, 'index.json'), {
        pages: tpages,
        limit: perpage,
        total: tarr.length
      });
    }
    add(files, path.join(filepath, 'home.json'), {
      results: arr.slice(0, 2)
    });
  };
}
