const mongoose = require("mongoose")


const contactSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    contacts: [{
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