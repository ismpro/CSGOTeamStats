const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let linkSchema = Schema({
    link: String,
    type: String,
    state: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    expireDate: Date
}, {
    collection: 'Link'
});

module.exports = mongoose.model('Link', linkSchema);