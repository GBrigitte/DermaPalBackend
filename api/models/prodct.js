const mongoose = require('mongoose');

const prodctSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    acnetype:String, 
    name:String,
    brand:String,
    Description:String,
    instructions:String
});

module.exports = mongoose.model('Prodct', prodctSchema);