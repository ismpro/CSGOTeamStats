const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let teamsSchema = Schema({
    name: String,
    acrony: String,
    apiId: Number,
    image_url: String,
    slug: String
});

teamsSchema.methods.generateImage = function (base64) {

    return 'not implemented'
}
teamsSchema.methods.getImage = function () {
    return 'not implemented'
}

module.exports = mongoose.model('Teams', teamsSchema);