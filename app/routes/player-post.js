const {
    parseComments
} = require('../functions.js');
const Teams = require('../models/Teams.js');
const Players = require('../models/Players.js');
const Comment = require('../models/Comments.js');

const getTeam = async (id) => {
    return new Promise((resolve, reject) => {
        Teams.findOne({
            id: id
        }, function (err, team) {
            if (!err && team) {
                resolve({
                    id: team.id,
                    name: team.name,
                    logo: team.logo,
                })
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    })
}

const getComments = (id) => {
    return new Promise((resolve, reject) => {
        Comment.find({
            type: 'player',
            id: id
        }, function (err, comments) {
            if (!err) {
                parseComments(comments)
                    .then(parsedComments => resolve(parsedComments))
                    .catch(err => reject(err.message))
            } else {
                reject(err.message)
            }
        })
    })
}

module.exports = function (api) {
    return function (req, res) {
        let id = req.params.id;
        Players.findOne({
            id: id
        }, function (err, player) {
            if (!err) {
                if (player) {
                    if (player.team) {
                        Promise.all([getTeam(player.team.id), getComments(player.id)])
                            .then(data => {
                                res.status(200).json({
                                    player: player,
                                    team: team,
                                    comments: parsedComments
                                })
                            })
                            .catch(err => {
                                res.status(500).send(err)
                            })
                    } else {
                        getComments(player.team.id).then(data => {
                            res.status(200).json({
                                player: player,
                                comments: data
                            })
                        }).catch(err => {
                            res.status(500).send(err)
                        })
                    }
                } else {
                    console.log('No player')
                    api.fetchPlayerById(id)
                        .then(player => {
                            Promise.all([getTeam(player.team.id), getComments(player.id)])
                                .then(data => {
                                    res.status(200).json({
                                        player: player,
                                        team: team,
                                        comments: parsedComments
                                    })
                                })
                                .catch(err => {
                                    res.status(500).send(err)
                                })
                            res.status(200).json(parsedTeam)
                        }).catch(err => {
                            console.log(err)
                            res.status(200).send(false)
                        })
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}