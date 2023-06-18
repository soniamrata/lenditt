const { encryptData, decryptData } = require("../../helper/crypto.js")
const contactModel = require("../models/contactModel.js")

const bcrypt = require("bcrypt")

const createContact = async function (req, res) {
  try {
    const data = req.body

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Body can't be empty" })
    }

    const { userId, contacts } = data

    let contactsArray = []

    if (Array.isArray(contacts)) {
      contactsArray = contacts
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Contacts should be an array" })
    }
    const contactEntity = { userId, contacts: [] }
    const getUser = await contactModel.findOne({
      userId: contactEntity.userId
    })
    const duplicateContacts = []
    for (let i = 0; i < contactsArray.length; i++) {
      const contact = contactsArray[i]
      const { name, number } = contact
      const hashedNumber = await encryptData(number, 10)
      const contactObj = { number: hashedNumber, name }

      if (getUser) {
        const user = await contactModel.find(
          {
            userId,
            "contacts.number": hashedNumber
          },
          {
            _id: 0,
            "contacts.$": 1
          }
        )
        console.log(user)
        if (user.length) {
          duplicateContacts.push(contact)
        } else {
          contactEntity.contacts.push(contactObj)
        }
      } else {
        contactEntity.contacts.push(contactObj)
      }
    }

    if (getUser) {
      await contactModel.updateOne(
        { userId: contactEntity.userId },
        { $push: { contacts: { $each: contactEntity.contacts } } }
      )
    } else {
      await contactModel.create(contactEntity)
    }
    return res.status(201).send({
      success: true,
      message: "Data saved successfully",
      duplicateContacts
    })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

// const createContact2 = async function(req,res){
//     const data = req.body
//     const{userId,Contacts} = data

//     for(i of Contacts){
//         const{name,number} = i
//         const hashedNumber = bcrypt.hashSync(number, 10);
//         const user = await contactModel.findOne({number:number})
//         if(user){
//             continue
//         }else{
//         const newUser = await contactModel.create({userId,...i})
//         }
//     }
//     return res.status(201).send({ status: true, message: "contacts added"})

// }

const findContacts = async function (req, res) {
  const data = req.query
  const hashedNumber = encryptData(data.searchNumber)
  const user = await contactModel.find(
    {
      "contacts.number": hashedNumber
    },
    {
      userId: 1,
      "contacts.$": 1
    }
  )
  const commonUser = user.map((i) => i.userId)
  return res
    .status(201)
    .send({ Name: user?.[0]?.contacts?.[0]?.name, commonuser: commonUser })
}

const findContactsByPagination = async function (req, res) {
  const { page = 1, pageSize = 10, userId } = req.query
  const resposeBody = {
    totalCount: 0,
    rows: []
  }

  const count = await contactModel.findOne({ userId })

  const users = await contactModel.find(
    { userId },
    { contacts: { $slice: [(+page - 1) * +pageSize, +pageSize] } }
  )
  const contactsRow = users?.[0]?.contacts.map((item) => {
    return { name: item.name, number: decryptData(item.number) }
  })
  resposeBody.rows = contactsRow || []
  resposeBody.totalCount = count?.contacts?.length || 0
  return res.status(201).send(resposeBody)
}

module.exports = { createContact, findContacts, findContactsByPagination }
