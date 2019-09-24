                                            //bundles the routes in the routes folder

const express = require('express')          // gives us access to express to give us the router function
const router = express.Router()             // gives us access to routing

require('./routes/transaction')(router)     // this bundels the transaction routes into the router
require('./routes/user')(router)            // this bundels the user routes into the router

module.exports = router