const {
    parseComments
} = require('../functions.js');
const Teams = require('../models/Teams.js');
const Players = require('../models/Players.js');
const Comment = require('../models/Comments.js');

module.exports = function () {
    return function (req, res) {
        let id = req.params.id;
        Players.findOne({
            id: id
        }, function (err, player) {
            if (!err) {
                if (player.team) {
                    Teams.findOne({
                        id: player.team.id
                    }, function (err, team) {
                        if (!err) {
                            Comment.find({
                                type: 'player',
                                id: id
                            }, function (err, comments) {
                                if (!err) {
                                    parseComments(comments).then(parsedComments => {
                                        res.status(200).json({
                                            player: player,
                                            team: team,
                                            comments: parsedComments
                                        })
                                    })
                                } else {
                                    res.status(500).send('Error on server! Try again later!')
                                }
                            })
                        } else {
                            res.status(500).send('Error on server! Try again later!')
                        }
                    })
                } else {
                    player.team = null
                    res.status(200).json(player)
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}