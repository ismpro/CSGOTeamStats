const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let commentsSchema = Schema({
    type: String,
    id: Number,
    text: String,
    date: Date,
    isAnon: Boolean,
    hasEdit: Schema.Types.Mixed,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    collection: 'Comment'
});

module.exports = mongoose.model('Comment', commentsSchema);