const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

let commentsGame = mongoose.Schema({
    title: String,
    text: String,
    ref: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
});

let commentsTeams = mongoose.Schema({
    title: String,
    text: String,
    ref: {
        type: Schema.Types.ObjectId,
        ref: 'Teams'
    }
});

let commentsPlayers = mongoose.Schema({
    title: String,
    text: String,
    ref: {
        type: Schema.Types.ObjectId,
        ref: 'Players'
    }
});

var userSchema = mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    creationDate: Date,
    atribuitesessionid: String,
    comments: {
        players: [commentsPlayers],
        teams: [commentsTeams],
        games: [commentsGame]
    },
    favorite: {
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'Players'
        }],
        teams: [{
            type: Schema.Types.ObjectId,
            ref: 'Teams'
        }]
    }
}, {
    collection: 'Users'
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);