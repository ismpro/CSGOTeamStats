const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let playersSchema = Schema({
    name: String,
    first_name: String,
    hometown: String,
    apiId: Number,
    image_url: String,
    last_name: String,
    role: String,
    slug: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Teams'
    }
});

module.exports = mongoose.model('Players', playersSchema);