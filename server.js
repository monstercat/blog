const express = require('express')
const app = express()
const port = process.env.PORT || 5500

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('build'))
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
