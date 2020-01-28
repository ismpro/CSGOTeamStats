const User = require('../../../../models/User')

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