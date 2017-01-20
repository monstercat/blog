var fs = require('fs');
var join = require('path').join;

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
  obj.date    = post.date;
  obj.author  = post.author;
  obj.subline = post.subline;
  obj.image   = post.image;
  obj.path    = post.path;
  obj.excerpt = getExcerpt(post) || post.excerpt;
  obj.tags    = getTags(post);
  return obj;
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
    var arr = metalsmith.metadata().posts.map(mapPost);
    var tagmap = buildTagMap(arr);
    var pages = Math.ceil(arr.length / perpage);
    for (var i=0; i<pages; i++) {
      var page = i + 1
      var obj = {
        page: page,
        pages: pages,
        limit: perpage,
        total: arr.length,
        results: arr.slice(pages * i, perpage)
      }
      add(files, join(filepath, 'archive', 'pages', page+'.json'), obj);
    }
    add(files, join(filepath, 'archive', 'index.json'), {
      pages: pages,
      limit: perpage,
      total: arr.length
    });
    add(files, join(filepath, 'tags', 'index.json'), Object.keys(tagmap));
    add(files, join(filepath, 'home.json'), {
      results: arr.slice(0, 2)
    });
  };
}