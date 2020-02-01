const Comment = require('../../models/Comment');

/**
 * Function that deletes comments
 * The body is expected an id of the comment
 * @module Comment/Delete
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        if (req.session.userid) {
            Comment.findByIdAndDelete(req.body.id, function (err) {
                if (!err) {
                    res.status(200).send(true)
                } else {
                    res.status(500).send('Error on Server!')
                }
            })
        } else {
            res.status(200).send(false)
        }
    }
}