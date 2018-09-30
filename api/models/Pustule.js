const mongoose = require('mongoose');

const PustulesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TreatmentType:String,
    Name:String,
    Description:String,
});

module.exports = mongoose.model('Pustule', PustulesSchema);