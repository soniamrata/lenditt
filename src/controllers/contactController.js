const {encryptData} = require("../../helper/crypto.js")
const contactModel = require("../models/contactModel.js")

const bcrypt = require('bcrypt');


const createContact = async function (req, res) {
    try {
    const data = req.body;
    
    if (Object.keys(data).length === 0) {
    return res
    .status(400)
    .send({ status: false, message: "Body can't be empty" });
    }
    
    const { userId, contacts } = data;
    
    
    let contactsArray = [];
    
    if (Array.isArray(contacts)) {
    contactsArray = contacts;
    } else {
    return res
    .status(400)
    .send({ status: false, message: 'Contacts should be an array' });
    }
    const contactEntity = { userId, contacts: [] };
    const getUser = await contactModel.findOne({
    userId: contactEntity.userId,
    });
    const duplicateContacts = [];
     for (let i = 0; i < contactsArray.length; i++) {
    const contact = contactsArray[i];
    const { name, number } = contact;
    const hashedNumber = await encryptData(number, 10);
    const contactObj = { number: hashedNumber, name };
    
    if(getUser){
        const user = await contactModel.find({
            userId,
              "contacts.number": hashedNumber
            },
            {
              _id: 0,
              "contacts.$": 1
            })
    console.log(user);
    if (user.length) {
    duplicateContacts.push(contact);
    } else {
    contactEntity.contacts.push(contactObj);
    }
    }else{
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
    return res
    .status(201)
    .send({
    success: true,
    message: 'Data saved successfully',
    duplicateContacts,
    });
    } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
    }
    };

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

const findContacts =async function(req,res){
    const data = req.query
    const hashedNumber = encryptData(data.number)
    const user = await contactModel.find({
        "contacts.number": hashedNumber
      },
      {
        userId: 1,
        "contacts.$": 1
      })
return res.status(201).send({"Name": user?.[0]?.contacts?.[0]?.name, "commonuser": user.length})
 }

module.exports = {createContact,findContacts};