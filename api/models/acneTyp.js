const mongoose = require('mongoose');

const acneTypSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    section: String,
    cause: String,
    treatmnt: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
    
});

module.exports = mongoose.model('AcneTyp', acneTypSchema);