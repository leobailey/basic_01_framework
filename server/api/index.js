                                            // bundles the routes in the routes folder

const express = require('express')          // gives us access to express to give us the router function
const router = express.Router()             // gives us access to routing

require('./routes/transaction')(router)     // this bundels the transaction routes and passes in the router that is required for the object that it exports
require('./routes/user')(router)            // this bundels the user routes and passes in the router router that is required for the object that it exports

module.exports = router