const User = require('../../../../models/User')

/**
 * Returns all the Users
 * @module Admin/User/Get
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        User.find({}, function (err, users) {
            if (!err) {
                res.status(200).send(users)
            } else {
                res.status(500).send('Server Error')
            }
        })
    }
}