const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let linkSchema = Schema({
    link: String,
    type: String,
    state: String,
    expireDate: Date
}, {
    collection: 'Links'
});

module.exports = mongoose.model('Link', linkSchema);