const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let teamsSchema = Schema({
    name: String,
    acronym: String,
    apiId: Number,
    image_url: String,
    slug: String
}, { collection: 'Teams' });

module.exports = mongoose.model('Teams', teamsSchema);