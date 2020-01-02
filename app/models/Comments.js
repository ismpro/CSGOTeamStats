const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let commentsSchema = Schema({
    type: String,
    id: Number,
    text: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    collection: 'Links'
});

module.exports = mongoose.model('Comment', commentsSchema);