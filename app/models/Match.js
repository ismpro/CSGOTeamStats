const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let matchSchema = Schema({
    name: String,
    begin: Date,
    isDetailed: Boolean,
    draw: Boolean,
    end: Date,
    forfeit: Boolean,
    games: [{
        begin: Date,
        isDetailed: Boolean,
        end: Date,
        finished: Boolean,
        forfeit: Boolean,
        id: Number,
        length: Number,
        position: Number,
        status: String,
        video_url: String,
        winner: {
            type: Schema.Types.ObjectId,
            ref: 'Teams'
        }
    }],
    apiId: Number,
    league: {
        apiId: Number,
        image_url: String,
        name: String,
        slug: String,
        url: String
    },
    live: {
        opens_at: Date,
        supported: Boolean,
        url: String
    },
    match_type: String,
    modified: Date,
    number_of_games: Number,
    opponents: [{
        type: Schema.Types.ObjectId,
        ref: 'Players'
    }],
    results: [{
        score: Number,
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Teams'
        }
    }],
    scheduled_at: String,
    serie: {
        begin: Date,
        description: String,
        end: Date,
        full_name: String,
        id: Number,
        modified: Date,
        name: String,
        slug: String,
        winner_id: Number,
        winner_type: String,
        year: Number
    },
    serie_id: Number,
    slug: String,
    status: String,
    tournament: {
        begin: Date,
        end: Date,
        id: Number,
        live_supported: Boolean,
        modified: Date,
        name: String,
        prizepool: String,
        slug: String,
    },
    winner: String
}, {
    collection: 'Matches'
});

module.exports = mongoose.model('Match', matchSchema);