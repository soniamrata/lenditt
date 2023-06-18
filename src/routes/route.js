const express = require('express');
const router = express.Router()
const {createContact, findContacts} = require("../controllers/contactController.js")

// --------- routes for createing contacts------------//
router.post("/savedContact", createContact)
// --------- route for get user details----------//
// router.get("/getContacts", findContacts)


module.exports = router