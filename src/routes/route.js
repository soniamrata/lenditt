const express = require("express")
const router = express.Router()
const {
  createContact,
  findContacts,
  findContactsByPagination
} = require("../controllers/contactController.js")

// --------- routes for createing contacts------------//
router.post("/savedContact", createContact)

// --------- route for get Contacts details----------//
router.get("/getContacts", findContacts)

// ------------route for fetch contacs by userId-------------//
router.get("/contactsByUserId", findContactsByPagination)

module.exports = router
