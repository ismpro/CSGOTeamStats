const {
    parseComments
} = require('../functions.js');
const Teams = require('../models/Team');
const Players = require('../models/Player');
const User = require('../models/User');
const Comment = require('../models/Comment');

module.exports = function (api) {

    const getTeam = (id) => {
        return new Promise((resolve, reject) => {
            Teams.findOne({
                id: id
            }, function (err, team) {
                if (!err) {
                    if (team) {
                        resolve({
                            id: team.id,
                            name: team.name,
                            logo: team.logo
                        })
                    } else {
                        api.fetchTeamById(id).then(unparsedTeam => {
                            if (unparsedTeam.players && Array.isArray(unparsedTeam.players) && unparsedTeam.players.length < 5) {
                                for (let index = unparsedTeam.players.length + 1; index >= 5; index++) {
                                    unparsedTeam.players.length[index] = {
                                        id: 0,
                                        name: ''
                                    }
                                }
                            }
                            let parsedTeam = {
                                id: unparsedTeam.id,
                                name: unparsedTeam.name,
                                logo: unparsedTeam.logo,
                                location: unparsedTeam.location,
                                facebook: unparsedTeam.facebook,
                                twitter: newunparsedTeamTeam.twitter,
                                rank: unparsedTeam.rank,
                                players: unparsedTeam.players.map(player => ({
                                    id: Number.isNaN(player.id) ? 0 : player.id,
                                    name: player.name || ''
                                })),
                                recentResults: team.recentResults
                            }
                            let newTeam = new Teams(parsedTeam)
                            newTeam.save(() => {
                                resolve({
                                    id: parsedTeam.id,
                                    name: parsedTeam.name,
                                    logo: parsedTeam.logo
                                })
                            })
                        }).catch(() => {
                            resolve(null)
                        })
                    }
                } else {
                    reject(null)
                }
            })
        })
    }

    const getComments = (id, user_id) => {
        return new Promise((resolve, reject) => {
            console.log(user_id)
            Comment.find({
                type: 'player',
                id: id
            }, function (err, comments) {
                if (!err) {
                    parseComments(comments, user_id)
                        .then(parsedComments => resolve(parsedComments))
                        .catch(err => reject(err.message))
                } else {
                    reject(err.message)
                }
            })
        })
    }

    return function (req, res) {
        let id = req.params.id;
        Players.findOne({
            id: id
        }, function (err, player) {
            if (!err) {
                if (player) {
                    if (player.team) {
                        Promise.all([getTeam(player.team.id), getComments(player.id, req.session.userid)])
                            .then(data => {
                                console.log(data[1])
                                res.status(200).json({
                                    player: player,
                                    team: data[0],
                                    comments: data[1]
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).send(err)
                            })
                    } else {
                        getComments(player.id, req.session.userid).then(data => {
                            res.status(200).json({
                                player: player,
                                comments: data
                            })
                        }).catch(err => {
                            res.status(500).send(err)
                        })
                    }
                } else {
                    api.fetchPlayerById(id)
                        .then(player => {
                            let newPlayer = new Players(player)
                            Promise.all([newPlayer.save(), player.team ? getTeam(player.team.id) : null, getComments(player.id, req.session.userid)])
                                .then(data => {
                                    res.status(200).json({
                                        player: player,
                                        team: data[0],
                                        comments: data[1]
                                    })
                                })
                                .catch(err => {
                                    res.status(500).send(err)
                                })
                        }).catch(() => {
                            res.status(200).send(false)
                        })
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}