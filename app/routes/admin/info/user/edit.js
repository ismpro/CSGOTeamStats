const User = require('../../../../models/User')

/**
 * Edits a single user
 * @module Admin/User/Edit
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        let userEdit = req.body
        User.findById(userEdit._id, function (err, user) {
            if (!err) {
                user.admin = userEdit.admin
                user.email = userEdit.email
                user.firstName = userEdit.firstName
                user.lastName = userEdit.lastName
                user.save((err) => {
                    if (!err) {
                        res.status(200).send(true)
                    } else {
                        res.status(500).send(err.message)
                    }
                })
            } else {
                res.status(500).send(err.message)
            }
        })
    }
}