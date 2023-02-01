const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({

    fname:{type: String, require: true, trim : true},

    lname:{type: String, require: true, trim: true},

    title:{type: String, require: true, enum:['Mr', 'Mrs', 'Miss'], trim: true},

    email:{type: String, require: true, unique: true, trim: true, lowercase: true},

    password:{ type:String, require: true, trim: true }
},{timestamps: true })

module.exports = mongoose.model('author', authorSchema)