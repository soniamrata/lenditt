//---------------------- Importing Module and Packages ----------------------//
const express = require("express")
const mongoose = require("mongoose")

const route = require("./routes/route.js")
const app = express()
require("dotenv").config();

app.use(express.json())

//---------------------- Make Relation Between MongoDb and Nodejs with MongoDb Cluster Link  ----------------------//
mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log(("Mongoose is connected")))
    .catch((err) => console.log(err.message))


//---------------------- Global Middleware for All Route ----------------------//
app.use("/", route)


//---------------------- PORT ----------------------//
app.listen(process.env.PORT, function () {
    console.log(`Express is running on port: ${process.env.PORT}`)
})

//<<<------------------------------------------------------------------->>>//)

