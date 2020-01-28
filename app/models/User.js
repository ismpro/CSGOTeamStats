const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    creationDate: Date,
    atribuitesessionid: String,
    adminatribuitesessionid: String,
    admin: Schema.Types.Mixed,
    favorite: {
        players: [Number],
        teams: [Number]
    }
}, {
    collection: 'User'
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);