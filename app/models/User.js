const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Types = mongoose.Schema.Types;

/**
 * Model User for mongodb
 */
const UserSchema = new mongoose.Schema({
    /**
    * Email of the user
    */
    email: String,
    /**
    * First Name of the user
    */
    firstName: String,
    /**
    * Last Name of the user
    */
    lastName: String,
    /**
    * A hash of the password. Don's user this to compare - use the method validPassword!
    */
    password: String,
    /**
    * When has the user created
    */
    creationDate: Date,
    /**
    * The id of the user session
    */
    atribuitesessionid: String,
    /**
    * The id of the user admin session
    */
    adminatribuitesessionid: String,
    /**
    * If the user is a admin or not
    */
    admin: Types.Mixed,
    /**
    * The user favorites
    */
    favorite: {
        /**
        * The id of players favorites
        */
        players: [Number],
        /**
        * The id of teams favorites
        */
        teams: [Number],
        /**
        * The id of matches favorites
        */
        matches: [Number],
    }
}, {
    /**
    * Warning: Ignore this!
    */
    collection: 'User'
});

/**
 * Hashs a password
 * @param {String} password Password that will be turn into a hash
 */
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

/**
 * Compares a password with the password in the data base without dehashing
 * @param {String} password Password to compare
 */
UserSchema.methods.validPassword = function (password) {
    // @ts-ignore
    return bcrypt.compareSync(password, this.password);
}

/**
* The full name of the user
*/
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', UserSchema);