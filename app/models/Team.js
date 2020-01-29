const mongoose = require('mongoose')

const Types = mongoose.Schema.Types;

const TeamsSchema = new mongoose.Schema({
    /**
    * ID of the team
    */
    id: { type: Number, index: true, unique: true, required: true },
    /**
    * Name of the team
    */
    name: String,
    /**
    * Url of image
    */
    logo: String,
    /**
    * Country of the team where is located
    */
    location: Types.Mixed,
    /**
    * The url of the facebook
    */
    facebook: String,
    /**
    * The url of the twitter
    */
    twitter: String,
    /**
    * The number where this team is located on the global ranking
    */
    rank: Number,
    /**
    * The players on this team
    */
    players: [{
        name: String,
        id: Number
    }],
    /**
    * Some recent matches
    */
    recentResults: [{
        matchID: Number,
        enemyTeam: {
            id: Number,
            name: String
        },
        result: String
    }]
}, {
    /**
    * Warning: Ignore this!
    */
    collection: 'Team'
});

module.exports = mongoose.model('Team', TeamsSchema);