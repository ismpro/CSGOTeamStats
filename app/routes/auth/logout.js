const User = require('../../models/User');

/**
 * Module that logout a user
 * @module Auth/Logout
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        if (req.session.userid) {
            User.findById(req.session.userid, function (err, user) {
                if (!err) {
                    if (req.session.adminsessionId) {
                        user.adminatribuitesessionid = 'expired';
                    }
                    if (req.session.sessionId) {
                        user.atribuitesessionid = 'expired';
                    }
                    Promise.all([user.save(), req.session.destroy()])
                        .then(() => {
                            res.status(200).send(true)
                        }).catch(err => {
                            console.log(err)
                            res.status(500).send(err)
                        });
                } else {
                    console.log(err)
                    res.status(500).send(err)
                }

            })
        }
    }
}