var Metalsmith  = require('metalsmith'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    jsonapi     = require('./json-api');

Metalsmith(__dirname)
  .use(collections({
    posts:{
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(permalinks({
    pattern: './:collection/:title',
    relative: false
  }))
  .use(jsonapi())
  .destination('./build')
  .build(function(err) {if(err) console.log(err)});
