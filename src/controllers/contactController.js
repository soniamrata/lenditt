const { encryptData, decryptData } = require("../../helper/crypto.js")
const contactModel = require("../models/contactModel.js")

const bcrypt = require("bcrypt")


//-------------------API 1 function for the creation of contacts-----------------//

const createContact = async function (req, res) {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      return res.status(400).send({ status: false, message: "Body can't be empty" });
    }

    const { userId, contacts } = data;

    let contactsArray = [];

    if (Array.isArray(contacts)) {
      contactsArray = contacts;
    } else {
      return res.status(400).send({ status: false, message: "Contacts should be an array" });
    }

    const contactEntity = { userId, contacts: [] };
    const getUser = await contactModel.findOne({ userId: contactEntity.userId });

    const duplicateContacts = [];

    for (let i = 0; i < contactsArray.length; i++) {
      const contact = contactsArray[i];
      const { name, number } = contact;
      const hashedNumber = await encryptData(number, 10);
      const contactObj = { number: hashedNumber, name };

      // Check if the number is a duplicate in the current request
      const isDuplicate = contactsArray.slice(0, i).some((c) => c.number === contact.number);

      if (isDuplicate) {
        duplicateContacts.push(contact);
        continue; // Skip the duplicate contact and move to the next iteration
      }

      if (getUser) {
        const user = await contactModel.findOne(
          { userId, "contacts.number": hashedNumber },
          { _id: 0, "contacts.$": 1 }
        );

        if (user && user.contacts.length) {
          duplicateContacts.push(contact);
        } else {
          contactEntity.contacts.push(contactObj);
        }
      } else {
        contactEntity.contacts.push(contactObj);
      }
    }

    if (getUser) {
      await contactModel.updateOne(
        { userId: contactEntity.userId },
        { $push: { contacts: { $each: contactEntity.contacts } } }
      );
    } else {
      await contactModel.create(contactEntity);
    }

    return res.status(201).send({
      success: true,
      message: "Data saved successfully",
      duplicateContacts,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
//------------------------- Api 2 function for the fetchind data by query-------------//
const findContacts = async function (req, res) {
  try{
  const data = req.query
  const hashedNumber = encryptData(data.searchNumber)
  const user = await contactModel.find(
    {"contacts.number": hashedNumber},
    {userId: 1,"contacts.$": 1}
  )
  const commonUser = user.map((i) => i.userId)
  return res.status(201).send({ Name: user?.[0]?.contacts?.[0]?.name, commonuser: commonUser })
}catch(error){
  return res.status(500).send({status:false,message:error.message})
}
}

//------------------- Api 3 function for find data by id-------------------------//
const findContactsByPagination = async function (req, res) {
  try{
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
}catch(error){
  return res.status(500).send({status:false,message:error.message})
}
}

module.exports = { createContact, findContacts, findContactsByPagination }
