const User = require('../../../../models/User')

/**
 * Deletes a single user
 * @module Admin/User/Delete
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        let id = req.body.id;
        User.findByIdAndDelete(id, function (err, deletedUser) {
            if (!err) {
                res.status(200).send(deletedUser.email)
            } else {
                res.status(500).send('Error on server')
            }
        })
    }
}