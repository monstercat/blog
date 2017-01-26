var gaze = require('gaze');
var spawn = require('child_process').spawn
gaze('src/posts/*.md', function(err, watcher) {
  this.on('all', function(event, filepath) {
		console.log("building...");
    spawn("node", ['index.js']);  
  }); 
});
