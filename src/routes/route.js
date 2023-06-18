const express = require("express")
const router = express.Router()
const {
  createContact,
  findContacts,
  findContactsByPagination
} = require("../controllers/contactController.js")

// --------- routes for createing contacts------------//
router.post("/savedContact", createContact)
// --------- route for get user details----------//
router.get("/getContacts", findContacts)
router.get("/contactsByUserId", findContactsByPagination)

module.exports = router
