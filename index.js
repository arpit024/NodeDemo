const express = require('express')
const app = express();
const routes = require('./routes')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const passport = require('passport')
const initializePassport= require('./passport_Auth')
const publisher = require('./publisher')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use(expressValidator())
app.use(passport.initialize());
initializePassport(passport)
//router
app.use('/api',routes)

//error handler
app.use((err, req, res, next)=> {
  console.log(err)
    res.status(err.status || 500)
    res.json({ message: err.message })
})
  
app.listen(4001, ()=>{console.log("server is running on port 4001")})
publisher.startPublisher()
