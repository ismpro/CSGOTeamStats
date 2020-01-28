const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let linkSchema = new Schema({
    link: String,
    type: String,
    state: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expireDate: Date
}, {
    collection: 'Link'
});

module.exports = mongoose.model('Link', linkSchema);