const contactModel = require("../models/contactModel.js")
const bcrypt = require("bcrypt");
const validator = require("../validators/validator.js");

const createContact = async function(req,res){
    try{
    const data  = req.body
    if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, message: "No input provided" })};

    const{name,number} = req.body

    if(!name) {return res.status(400).send ({status:false,message:"Please provide name"})}

    if(!number) {return res.status(400).send({status:false,message:"please provide number"})}
    const removeDuplicateNumber = await contactModel.findOne({number:number}) 
    if (removeDuplicateNumber) {return res.status(400).send({ status: false, message: " user is allready exist with this number" }) }

     //*********************** phone number encryption using bcrypt*************************************** */
     
     hash = await bcrypt.hash(data.number, 10);

     const newUser = await contactModel.insertMany([
        {
            userId : 1,
            contacts:[{
            name: "Radha",
            number : "1234567898"
        }]
        },
        {
            userId : 2,
            contacts:[{
            name : "Arju",
            number: "0987354134"
        
    }]
}

     ])
     return res.status(201).send({ success: true, message : "data saved successfully}" })
    }

catch(error){
    return res.status(500).send({status:false, message:error.message})
}
}

module.exports = {createContact}
