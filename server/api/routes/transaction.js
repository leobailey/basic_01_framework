const Transaction = require('../../models/transaction')                     // give us a reference to the mogoose model we are using - in this case transaction 
const mongoose = require('mongoose')

module.exports = function (router) {
  // Get transactions for given year and month, by userId...
  router.get('/transaction/:year/:month', function (req, res) {           // year and month parameter to the end point
    const userId = req.get('userId')                                      // gets the user id to the end point by putting it in the headder
    const month = req.params.month - 1 // JS months are zero-based        // set up month by getting it out of the request and converting it ready for JS
    const year = req.params.year                                          // set up year by getting it out of the request
    const startDt = new Date(Date.UTC(year, month, 1, 0, 0, 0))           // sets up start date - by defining format and using the variable we have gathered above
    const endDt = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0))         // sets up end date - - by defining format and using the variable we have gathered above

    const qry = {                                                         // the build the mongoose query object
      userId: userId,                                                     // User Id selection criteria
      transactionDate: {                                                  // transactionDate selection criteria    
        $gte: startDt,                                                    // greater than startDt
        $lt: endDt                                                        // less than endDt
      }
    }

    Transaction.find(qry)                                                 // passes the mongoose query object into the Mongoose Model .find funtion
      .sort({ 'transactionDate': 1 })                                     // define how we want the results sorted
      .exec()                                                             // executes the find function promise ?
      .then(docs => res.status(200)                                       // .then if the promise returns successfully - return status 200 and the results docs are returned in the json object
        .json(docs))
      .catch(err => res.status(500)                                       // .cathch handles the promise returning an error - return status 500 and populate the json object with useful error information
        .json({
          message: 'Error finding transactions for user',
          error: err
        }))
  })

  // Get transactions running balance for a specific user...
  router.get('/transaction/balance/:year/:month', function (req, res) {
    const userId = req.get('userId')
    const month = req.params.month - 1 // JS months are zero-based
    const year = req.params.year
    const endDt = new Date(Date.UTC(year, month, 1))                // set up enddate value
    const pipeline = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        }
      },
      {
        $match: {
          transactionDate: { $lt: endDt }                           // enddate matches /  filters documents
        }
      },
      {
        $group: {                                                   // this aggregates the results by defining the values we want back
          _id: null,  
          charges: { $sum: '$charge' },                             // sum of charges
          deposits: { $sum: '$deposit' }                            // sum of deposits
        }
      }
    ]

    Transaction.aggregate(pipeline).exec()                           // the pipleine object above is passed into the mongoose model aggregate function
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding transactions for user',
          error: err
        }))
  })

  // Create new transaction document...
  router.post('/transaction', function (req, res) {
    let transaction = new Transaction(req.body)
    transaction.save(function (err, transaction) {
      if (err) return console.log(err)
      res.status(200).json(transaction)
    })
  })
}
