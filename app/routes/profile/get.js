const User = require('../../models/User')
const Players = require('../../models/Player')
const Teams = require('../../models/Team')
const Match = require('../../models/Match')
const { formatDate } = require('../../functions')

module.exports = function () {

    const parseFav = async (favorite) => {
        if (favorite) {
            let parsedplayers = []
            if (favorite.players && Array.isArray(favorite.players) && favorite.players.length > 0) {
                for (const id of favorite.players) {
                    let player = await Players.findOne({ id: id })
                    parsedplayers.push({
                        id: player.id,
                        name: player.name,
                        ign: player.ign,
                        image: player.image
                    })
                }
            }
            let parsedteams = []
            if (favorite.teams && Array.isArray(favorite.teams) && favorite.teams.length > 0) {
                for (const id of favorite.teams) {
                    let team = await Teams.findOne({ id: id })
                    parsedteams.push({
                        id: team.id,
                        name: team.name,
                        logo: team.logo
                    })
                }
            }
            let parsedmatches = []
            if (favorite.matches && Array.isArray(favorite.matches) && favorite.matches.length > 0) {
                for (const id of favorite.matches) {
                    let match = await Match.findOne({ id: id })
                    parsedmatches.push({
                        id: match.id,
                        name: match.event,
                    })
                }
            }
            return {
                players: parsedplayers,
                teams: parsedteams,
                matches: parsedmatches
            }
        } else {
            return {
                players: [],
                teams: [],
                matches: []
            }
        }
    }

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