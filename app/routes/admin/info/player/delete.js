const Player = require('../../../../models/Player')

/**
 * Deletes a single user
 * @module Admin/Player/Delete
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        let id = req.body.id;
        Player.findByIdAndDelete(id, function (err, deletedPlayer) {
            if (!err) {
                res.status(200).send(deletedPlayer.ign)
            } else {
                res.status(500).send('Error on server')
            }
        })
    }
}