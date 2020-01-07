const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let teamsSchema = Schema({
    id: Number,
    name: String,
    logo: String,
    location: Schema.Types.Mixed,
    facebook: String,
    twitter: String,
    rank: Number,
    players: [{
        name: String,
        id: Number
    }],
    recentResults: [{
        matchID: Number,
        enemyTeam: {
            id: Number,
            name: String
        },
        result: String
    }]
}, {
    collection: 'Teams'
});

module.exports = mongoose.model('Teams', teamsSchema);