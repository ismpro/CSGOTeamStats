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
}, { collection: 'Players' });

playersSchema.virtual('fullName').get(function () {
    return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model('Players', playersSchema);