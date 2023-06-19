const mongoose = require("mongoose")


const contactSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    contacts: [{
        _id:0,
        name: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true,
            

        }
    }]
},
    { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);