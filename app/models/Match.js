const mongoose = require('mongoose')

/**
 * Player Stats for the Match Model
 * @typedef PlayerStats
 * @property {Number} id
 * @property {String} name
 * @property {Number} kills
 * @property {Number} killsPerRound
 * @property {Number} hsKills
 * @property {Number} assists
 * @property {Number} deathsPerRound
 * @property {Number} flashAssists
 * @property {Number} deaths
 * @property {Number} KAST
 * @property {Number} killDeathsDifference
 * @property {Number} ADR
 * @property {Number} firstKillsDifference
 * @property {Number} flasratinghAssists
 * @property {Number} impact
 */
const PlayerStats = new mongoose.Schema({
    id: Number,
    name: String,
    kills: Number,
    killsPerRound: Number,
    hsKills: Number,
    assists: Number,
    deathsPerRound: Number,
    flashAssists: Number,
    deaths: Number,
    KAST: Number,
    killDeathsDifference: Number,
    ADR: Number,
    firstKillsDifference: Number,
    rating: Number,
    impact: Number
})

/**
 * Model Match for mongodb
 */
let MatchSchema = new mongoose.Schema({
    /**
    * ID of the match
    */
    id: { type: Number, index: true, unique: true, required: true },
    /**
    * Stats ID of the match
    */
    statsId: Number,
    /**
    * Information of team 1
    */
    team1: {
        name: String,
        id: Number
    },
    /**
    * Information of team 1
    */
    team2: {
        name: String,
        id: Number
    },
    /**
    * The information of the winning team
    */
    winnerTeam: {
        name: String,
        id: Number
    },
    /**
    * Date of the match
    */
    date: Date,
    /**
    * Which of match was ex: bo3
    */
    format: String,
    /**
    * Name of the event
    */
    event: String,
    /**
    * Information of the maps
    */
    maps: [{
        map: String,
        team1: {
            name: String,
            id: Number,
            score: Number
        },
        team2: {
            name: String,
            id: Number,
            score: Number
        },
        playerStats: {
            team1: [PlayerStats],
            team2: [PlayerStats]
        },
        performanceOverview: {
            team1: {
                assists: Number,
                deaths: Number,
                kills: Number,
            },
            team2: {
                assists: Number,
                deaths: Number,
                kills: Number,
            }
        }
    }],
    /**
    * All the players of the match
    */
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
    /**
    * Status of the match ex: Match over
    */
    status: String,
    /**
    * The title of the match
    */
    title: String,
    /**
    * The Highlighted Player of the match
    */
    highlightedPlayer: {
        name: String,
        id: Number
    },
    vetoes: [mongoose.Schema.Types.Mixed],
    highlights: [{
        link: String,
        title: String
    }],
    demos: [{
        name: String,
        link: String
    }],
    /**
    * Some stats of the match
    */
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
    /**
    * Some player stats of the match
    */
    playerStats: {
        team1: [PlayerStats],
        team2: [PlayerStats]
    }
}, {
    /**
    * Warning: Ignore this!
    */
    collection: 'Match'
});

module.exports = mongoose.model('Match', MatchSchema);