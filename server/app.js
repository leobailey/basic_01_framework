const express = require('express')
const app = express()             // gets handle to express function
const api = require('./api')      // collects together all the routes in index.js //requires the contents of the api folder - api/index.js requires the lower level reoutes
const morgan = require('morgan')  //for logging
const bodyParser = require('body-parser') //for parsing html 

app.set('port', (process.env.PORT || 8081)) // sets the port for the server to listen on
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


// important location configuration
app.use('/api', api)              //makes the app use the api routes // clear guidance to where the apis re
app.use(express.static('static')) //set up express to have access to static files // clear guidance to where the static (front end?) files are

app.use(morgan('dev'))            // set up the app to do logging for development

app.use(function(req,res,next){             //handles requests to unknown resources
    const err = new Error('Not Found')
    err.status = 404
    res.json(err)
})

// database configuration
const mongoose = require('mongoose')                        //handle to mongo db
mongoose.connect('mongodb://localhost:27017/globomantics')  //connection string should be an environment variable
const db = mongoose.connection                              //grab the connection and set to a varibale

db.on('error', console.error.bind(console, 'connection error:')) // logs any connection errors
db.once('open', function () {                                    // handles the connection
  console.log('Connected to MongoDB')                            // log the successful connection

  app.listen(app.get('port'), function () {                      // set the server app listening on the port
    console.log('API Server Listening on port ' + app.get('port') + '!')    //log out a message that the app is now listening
  })
})