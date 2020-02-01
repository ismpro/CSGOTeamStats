const Match = require('../../../../models/Match')

/**
 * Deletes a single user
 * @module Admin/Match/Delete
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        let id = req.body.id;
        Match.findByIdAndDelete(id, function (err, deletedMatch) {
            if (!err) {
                res.status(200).send(deletedMatch.event)
            } else {
                res.status(500).send('Error on server')
            }
        })
    }
}