const User = require('../../models/Users')
const Players = require('../../models/Players')
const Teams = require('../../models/Teams')
const Match = require('../../models/Match')
const { formatDate } = require('../../functions')

module.exports = function () {

    return async function (req, res) {
        let id = req.params.id;
        if (id === '-') {
            if (req.session.userid) {
                User.findById(req.session.userid, async (err, user) => {
                    if (err) {
                        res.status(500).send(err.message)
                    } else {
                        if (user && user.atribuitesessionid === req.session.sessionId) {
                            let parsedFavorite = await parseFav(user.favorite)
                            res.status(200).json({
                                favorites: parsedFavorite,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                creationDate: formatDate(user.creationDate),
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
            User.findById(id, async (err, user) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    if (user) {
                        if (req.session.userid && user._id === req.session.userid) {
                            let parsedFavorite = await parseFav(user.favorite)
                            res.status(200).json({
                                favorites: parsedFavorite,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                creationDate: formatDate(user.creationDate),
                            })
                        } else {
                            res.status(200).json({
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                creationDate: formatDate(user.creationDate),
                            })
                        }
                    } else {
                        res.status(200).send(false)
                    }
                }
            })
        }
    }
}