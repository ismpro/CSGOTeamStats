// @ts-nocheck
const {
    parseComments
} = require('../functions.js');
const ApiControler = require('../config/ApiControler');
const Teams = require('../models/Team');
const Players = require('../models/Player');
const User = require('../models/User');
const Comment = require('../models/Comment');

/**
 * Module that deals with the information of a player post request.
 * In the url is expeted an id (/:id) then returns all the information of that player.
 * If the id doens't existis in the Database then is going to search in the api.
 * @module Player_Post
 * @param {ApiControler} api The api controller
 * @returns {Function}
 */
module.exports = function (api) {

    /**
     * Function that deals with the information of a team.
     * If the id doens't existis in the Database then is going to search in the api.
     * @param {number} id The id of the Team
     * @returns {Promise<{id: Number, name: String, logo: String}>}
     */
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

    /**
     * Function return the parsed comments or an empty [].
     * @param {number} id The id of the Player
     * @param {String} [user_id] The id of the User 
     * @returns {Promise<Array>}
     */
    const getComments = (id, user_id) => {
        return new Promise((resolve, reject) => {
            console.log(user_id)
            Comment.find({
                type: 'player',
                id: id
            }, function (err, comments) {
                if (!err) {
                    if (comments) {
                        parseComments(comments, user_id)
                            .then(parsedComments => resolve(parsedComments))
                            .catch(err => reject(err.message))
                    } else {
                        resolve([])
                    }
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