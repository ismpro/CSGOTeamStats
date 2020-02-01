// @ts-nocheck
const User = require('../../models/User');

/**
 * Function that set favorites
 * The body is expected an id
 * And Url is expected an type (/:type) player | team | match
 * @module Fav/Type_Post
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        let id = req.body.id
        let userId = req.session.userid
        let type = req.params.type
        User.findById(userId, function (err, user) {
            if (!err) {
                if (type === 'player') {
                    let boolean = user.favorite.players.includes(id)
                    if (boolean) {
                        user.favorite.players.splice(user.favorite.players.indexOf(id), 1)
                        res.status(200).send('remove')
                    } else {
                        user.favorite.players.push(id)
                        res.status(200).send('added')
                    }
                    user.save()
                } else if (type === 'team') {
                    let boolean = user.favorite.teams.includes(id)
                    if (boolean) {
                        user.favorite.teams.splice(user.favorite.teams.indexOf(id), 1)
                        res.status(200).send('remove')
                    } else {
                        user.favorite.teams.push(id)
                        res.status(200).send('added')
                    }
                    user.save()
                } else {
                    res.status(417).send('Type param failed')
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}