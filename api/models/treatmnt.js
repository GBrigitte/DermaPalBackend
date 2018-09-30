const mongoose = require('mongoose');

const treatmntSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tType:String,
    name:String,
    description:String,
    recipe:String,
});

module.exports = mongoose.model('Treatment', treatmntSchema);