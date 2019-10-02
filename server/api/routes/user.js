const User = require('../.../models/user')              // get reference to our mongoose model

module.exports = function (router){                     // the function exported requires a reference to router to be passed in, it follows that router needs to be passed into the route in the index.js file)
    router.get('/user/:id', function (req, res) {       // build out a get (by id) route and specify what the url will be to navigate to this route
        User.findById(req.params.id).exec()             // use the method to find the user - returns a promise that we can .then into to say what happens when the promise returns
        .then(docs => res.status(200)                   // success return status 200 and the json results
            .json(docs))        
        .catch(err => res.status(500)                   // .catch tells us what to do if the promise returns an error - error returns 500 and a error message
            .json({
                message: 'Error finding user',
                error: err    
            }))                       
    })

    router.get('/user/email/:email', function (req, res) {      //build out a get route and specify what the url will be to navigate to this route
        User.find({'email':req.params.email}).exec()             // use the method to find the info
        .then(docs => res.status(200)                   // promise success return status 200 and the json results
            .json(docs))        
        .catch(err => res.status(500)                   // promise error returns 500 and a error message
            .json({
                message: 'Error finding user',
                error: err    
            }))                       
    })

    router.post('/user',function (req,res){             // build out a post route to create data in the database
        let user = new User(req.body)                   // creates a variable of type of the mongo schema user from the User Model and instatiates it with the incoming data
        user.save(function(err, user){                  // saves the data into the model (and therefore into the database
            if (err) return console.log(err)            // reports any errors
            res.status(200).json(user)
        })
    })

    router.put('/user/:id', function (req, res) {       // updating an existing document
        console.log(req.body)                           // query object - exisiting object
        let qry = { _id: req.params.id }                // set up a document variable and mapping values
        let doc = {                                     
          // first: req.body.firstName,
          // last: req.body.lastName,
          // email: req.body.email,
          // password: req.body.password,
          isActive: req.body.isActive
        }
        console.log(doc)
        User.update(qry, doc, function (err, respRaw) {  // here we call into the update method and pass in the query object and the document object
          if (err) return console.log(err)               // if the update function errors then log any errors
          res.status(200).json(respRaw)                  // if the update function succeeds then return status 200 and the raw response document in the json object  
        })
      })

}



