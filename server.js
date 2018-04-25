const express = require('express')
const app = express()

app.use(express.static('build'))
app.listen(process.env.PORT || 5500, () => {
  console.log('Listening')
})
