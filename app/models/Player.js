const mongoose = require('mongoose')

const PlayersSchema = new mongoose.Schema({
    /**
    * ID of the player
    */
    id: { type: Number, index: true, unique: true, required: true },
    /**
    * The Full Name of the player
    */
    name: String,
    /**
    * In game Name of the player
    */
    ign: String,
    /**
    * Url of image
    */
    image: String,
    /**
    * Age of the player
    */
    age: Number,
    /**
    * The url of the twitter
    */
    twitter: String,
    /**
    * The url of the twitch
    */
    twitch: String,
    /**
    * The url of the facebook
    */
    facebook: String,
    /**
    * The country information of the player
    */
    country: {
        name: String,
        code: String
    },
    /**
    * Which team is the player in
    */
    team: {
        name: String,
        id: Number
    },
    /**
    * Some stats of the player
    */
    statistics: {
        rating: Number,
        killsPerRound: Number,
        headshots: Number,
        mapsPlayed: Number,
        deathsPerRound: Number,
        roundsContributed: Number
    },
    /**
    * Some achievements of the player (matches)
    */
    achievements: [{
        place: String,
        event: {
            name: String,
            id: Number
        }
    },],
}, {
    /**
    * Warning: Ignore this!
    */
    collection: 'Player'
});

module.exports = mongoose.model('Player', PlayersSchema);