const User = require('../../models/User');

/**
 * Function that get favorites
 * The body is expected an type player | team | match
 * @module Fav/Post
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        if (req.session.userid) {
            User.findById(req.session.userid, function (err, user) {
                if (!err) {
                    switch (req.body.type) {
                        case "player":
                            res.status(200).send(user.favorite.players.includes(req.body.id))
                            break;
                        case "team":
                            res.status(200).send(user.favorite.teams.includes(req.body.id))
                            break;
                        case "match":
                            res.status(200).send(user.favorite.matches.includes(req.body.id))
                            break;
                        default:
                            res.status(200).send('logout')
                            break;
                    }
                } else {
                    res.status(500).send('Error on server! Try again later!')
                }
            })
        } else {
            res.status(200).send('logout')
        }
    }
}