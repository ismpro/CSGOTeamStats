const User = require('../../models/Users')


module.exports = function () {
    return function (req, res) {
        let id = req.params.id;
        if (id === '-') {
            if (req.session.userid) {
                User.findById(req.session.userid, (err, user) => {
                    if (err) {
                        res.status(500).send(err.message)
                    } else {
                        if (user && user.atribuitesessionid === req.session.sessionId) {
                            let data = req.body
                            let passChange = ''
                            user.email = data.email
                            user.firstName = data.name[0] || ''
                            user.lastName = data.name[1] || ''
                            if (data.password[0]) {
                                if (data.password[1]) {
                                    if (user.validPassword(data.password[0])) {
                                        user.password = user.generateHash(data.password[1])
                                        passChange = 'All information saved and password change'
                                    } else {
                                        passChange = 'All information saved but Old Password invalid'
                                    }
                                } else {
                                    passChange = 'All information saved but New Password not passed'
                                }
                            } else {
                                passChange = 'All information saved'
                            }
                            user.save((err, user) => {
                                if (!err) {
                                    res.status(200).json({
                                        email: user.email,
                                        name: user.firstName + ' ' + user.lastName,
                                        pass: passChange
                                    })
                                } else {
                                    res.status(500).send(err.message)
                                }
                            })
                        } else {
                            res.status(200).send(false)
                        }
                    }
                })
            } else {
                res.status(200).send(false)
            }
        } else {
            res.status(200).send(false)
        }
    }
}