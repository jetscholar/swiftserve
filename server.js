if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const port = 4200
const express = require('express')
const mongoose = require('mongoose')
var app = express()
var Data = require('./noteSchema')

mongoose.connect(process.env.SECURE_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true, 
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to the swiftserve DB...'))

// Create a note (post)
app.post("/create", (req, res) => {
    var note = new Data ({
        note: req.get("note"),
        title: req.get("title"),
        date: req.get("date")
    })
    note.save().then(() => {
        if(note.isNew == false) {
            console.log("Data saved to DB.")
            res.send("Data saved")
        } else {
            console.log("Failed to save data.")
        }
    })
})

// Delete a note (post)
app.post("/delete", (req, res) => {
    Data.findOneAndDelete({
        _id: req.get("id")
    }, (err) => {
        console.log("Delete failed " + err)
    })
    res.send("File deleted")
})

// Update a note (post)
app.post('/update', (req, res) => {
    Data.findOneAndUpdate({
        _id: req.get("id")
    }, {
        note: req.get("note"),
        title: req.get("title"),
        date: req.get("date")
    }, (err) => {
        console.log("Failed to udate " + err)
    })
    res.send("Updated")
})


// Fetch a note (get)
app.get('/fetch', (req, res) => {
    Data.find({}).then((DBitems) => {
        res.send(DBitems)
    })
})

// http://192.168.1.3:4200/create
var server = app.listen(process.env.PORT || port, "192.168.1.3", () => {
    console.log('Server running on http://localhost:' + port)
})