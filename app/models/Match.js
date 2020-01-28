const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let playerStats = new Schema({
    id: Number,
    name: String,
    kills: Number,
    hsKills: Number,
    assists: Number,
    flashAssists: Number,
    deaths: Number,
    KAST: Number,
    killDeathsDifference: Number,
    ADR: Number,
    firstKillsDifference: Number,
    rating: Number
})

let matchSchema = new Schema({
    id: { type: Number, index: true, unique: true, required: true },
    statsId: Number,
    team1: {
        name: String,
        id: Number
    },
    team2: {
        name: String,
        id: Number
    },
    winnerTeam: {
        name: String,
        id: Number
    },
    date: Date,
    format: String,
    event: String,
    maps: [{
        map: String,
        team1: Schema.Types.Mixed,
        team2: Schema.Types.Mixed,
        playerStats: Schema.Types.Mixed,
        performanceOverview: Schema.Types.Mixed
    }],
    players: {
        team1: [{
            name: String,
            id: Number
        }],
        team2: [{
            name: String,
            id: Number
        }]
    },
    status: String,
    title: String,
    highlightedPlayer: {
        name: String,
        id: Number
    },
    vetoes: [Schema.Types.Mixed],
    highlights: [{
        link: String,
        title: String
    }],
    demos: [{
        name: String,
        link: String
    }],
    overview: {
        mostKills: {
            id: Number,
            name: String,
            value: Number
        },
        mostDamage: {
            id: Number,
            name: String,
            value: Number
        },
        mostAssists: {
            id: Number,
            name: String,
            value: Number
        },
        mostAWPKills: {
            id: Number,
            name: String,
            value: Number
        },
        mostFirstKills: {
            id: Number,
            name: String,
            value: Number
        },
        bestRating: {
            id: Number,
            name: String,
            value: Number
        }
    },
    playerStats: {
        team1: [playerStats],
        team2: [playerStats]
    }
}, {
    collection: 'Match'
});

module.exports = mongoose.model('Match', matchSchema);