const User = require('../../models/User');

module.exports = function () {
    return function (req, res) {
        if (req.session.userid) {
            User.findById(req.session.userid, (err, user) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    if (user && user.atribuitesessionid === req.session.sessionId) {
                        res.status(200).send(req.session.sessionId)
                    } else {
                        res.status(200).send(false)
                    }
                }
            })
        } else {
            res.status(200).send(false)
        }
    }
}