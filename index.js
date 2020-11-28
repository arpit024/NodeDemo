const express = require('express')
const app = express();
const routes = require('./routes')
let bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
//router
app.use('/api',routes)
//error handler
app.use((err, req, res, next)=> {
    res.status(err.status || 500)
    res.json({ message: err.message })
})
  
  app.listen(4001, ()=>{console.log("server is running on port 4001")})