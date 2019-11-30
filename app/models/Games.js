const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let gameSchema = Schema({
    name: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Teams'
    }
});

module.exports = mongoose.model('Players', gameSchema);