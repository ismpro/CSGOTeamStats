const mongoose = require('mongoose')

const Types = mongoose.Schema.Types;

/**
 * Model Comment for mongodb
 */
const CommentsSchema = new mongoose.Schema({
    /**
     * Type of the ID ("Player"|"Team"|"Match")
     */
    type: String,
    /**
    * The ID of the type
    */
    id: Number,
    /**
    * The text of the comment
    */
    text: String,
    /**
    * The date of the comment
    */
    date: Date,
    /**
    * If is anonymous or not
    */
    isAnon: Boolean,
    /**
    * Information from last edit (Boolean|{user: Number, date: Date})
    */
    hasEdit: Types.Mixed,
    /**
    * The ObjectId of the user that made this comment
    */
    user: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment', CommentsSchema);

