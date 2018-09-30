const mongoose = require('mongoose');

const PustulesSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TreatmentType:String,
    Name:String,
    Description:String,
    Product:String,
    Brand:String,
    Instructions:String
    
});

module.exports = mongoose.model('Pustule', PustulesSchema);