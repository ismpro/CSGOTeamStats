const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let playersSchema = Schema({
    id: Number,
    name: String,
    ign: String,
    image: String,
    age: Number,
    twitter: String,
    twitch: String,
    facebook: String,
    country: {
        name: String,
        code: String
    },
    team: {
        name: String,
        id: Number
    },
    statistics: {
        rating: Number,
        killsPerRound: Number,
        headshots: Number,
        mapsPlayed: Number,
        deathsPerRound: Number,
        roundsContributed: Number
    },
    achievements: [{
        place: String,
        event: {
            name: String,
            id: Number
        }
    }, ],
}, {
    collection: 'Player'
});

playersSchema.virtual('fullName').get(function () {
    return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model('Player', playersSchema);