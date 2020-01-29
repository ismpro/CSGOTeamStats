const mongoose = require('mongoose')

const Types = mongoose.Schema.Types;

/**
 * Model Links for mongodb
 */
const LinkSchema = new mongoose.Schema({
    /**
    * ID part of the url 
    */
    link: String,
    /**
    * The type of the url
    */
    type: String,
    /**
    * The state of the url ative, expire, etc
    */
    state: String,
    /**
    * The user linked to the url
    */
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    /**
    * The Expire Date
    */
    expireDate: Date
}, {
    /**
    * Warning: Ignore this!
    */
    collection: 'Link'
});

module.exports = mongoose.model('Link', LinkSchema);