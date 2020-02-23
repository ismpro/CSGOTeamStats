const User = require('../../models/User');
const Link = require('../../models/Link');

/**
 * Recesives a new link from a request for the admin program
 * @module Admin/Program_Id_Post
 * @deprecated
 */
module.exports = function () {
    return function (req, res) {
        let id = req.params.id;
        let type = req.query.type;
        if ((id && type) && (type === 'accept' || type === 'deny')) {
            Link.findOne({
                link: id
            }, function (err, link) {
                if (!err) {
                    if (link) {
                        let now = new Date().getTime()
                        let expireNumber = new Date(link.expire).getTime()
                        if (link.state !== 'expired' && expireNumber < now) {
                            if (type === 'accept') {
                                link.state = 'accept';
                                User.findById(link.user, function (err, user) {
                                    if (!err && user) {
                                        user.admin = true
                                        let userSave = user.save()
                                        let sessionSave = link.save()
                                        Promise.all([userSave, sessionSave]).then(() => {
                                            res.status(240).send('<h1>Admin Resquest Accepted</h1>')
                                        }).catch((err) => {
                                            res.status(500).send(err)
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            } else {
                                link.state = 'deny';
                                User.findById(link.user, function (err, user) {
                                    if (!err && user) {
                                        user.admin = 'ban'
                                        let userSave = user.save()
                                        let sessionSave = link.save()
                                        Promise.all([userSave, sessionSave]).then(() => {
                                            res.status(241).send('<h1>Admin Resquest Denied</h1>')
                                        }).catch((err) => {
                                            res.status(500).send(err)
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            }
                        } else {
                            if (link.state === 'expired') {
                                res.status(209).send('<h1>Link Expire</h1>')
                            } else {
                                User.findById(link.user, function (err, user) {
                                    if (!err && user) {
                                        link.state = 'expired'
                                        user.admin = false;
                                        Promise.all([user.save(), link.save()]).then(() => {
                                            res.status(209).send('<h1>Link Expire</h1>')
                                        }).catch((err) => {
                                            res.status(500).send(err)
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            }
                        }
                    } else {
                        res.status(404).send('<h1>Request Link Failed</h1>')
                    }
                } else {
                    res.status(500).send(err.message)
                }
            })
        } else {
            res.status(417).send('<h1>Params missing</h1>')
        }
    }
}