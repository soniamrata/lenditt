const express = require('express');
const router = express.Router()
const {createContact} = require("../controllers/contactController.js")

// --------- routes for createing contacts------------//
router.post("/savedContact", createContact)
// --------- route for get user details----------//
// router.get("/fetch",getUser)

module.exports = router