const User = require('../.../models/user')

module.exports = function (router){
    router.get('/user/:id', function (req, res) {      //build out a get route and specify what the url will be to navigate to this route
        User.findById(req.params.id).exec()             // use the method to find the user
        .then(docs => res.status(200)                   // success return status 200 and the json results
            .json(docs))        
        .catch(err => res.status(500)                   // error returns 500 and a error message
            .json({
                message: 'Error finding user',
                error: err    
            }))                       
    })

    router.get('/user/email/:email', function (req, res) {      //build out a get route and specify what the url will be to navigate to this route
        User.find({'email':req.params.email}).exec()             // use the method to find the info
        .then(docs => res.status(200)                   // success return status 200 and the json results
            .json(docs))        
        .catch(err => res.status(500)                   // error returns 500 and a error message
            .json({
                message: 'Error finding user',
                error: err    
            }))                       
    })

    router.post('/user',function (req,res){             // build out a post route to create data in the database
        let user = new User(req.body)                   // creates a variable of type of the mongo schema and instatiates it with the incoming data
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
          if (err) return console.log(err)               // log any errors
          res.status(200).json(respRaw)                     
        })
      })

}



