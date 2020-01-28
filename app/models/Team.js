const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let teamsSchema = new Schema({
    id: { type: Number, index: true, unique: true, required: true },
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
    collection: 'Team'
});

module.exports = mongoose.model('Team', teamsSchema);