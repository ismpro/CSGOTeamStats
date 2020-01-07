const Teams = require('../models/Teams')
const Players = require('../models/Players')
const Comment = require('../models/Comments.js')
const User = require('../models/Users.js')
const Match = require('../models/Match')
const functions = require('../functions.js')
const countryCode = require('country-code-lookup')

const getPlayer = async function (players) {
    let parsedPlayer = [];
    for (const player of players) {
        let playerInfo = await Players.findOne({
            id: player.id
        })
        if (playerInfo) {
            parsedPlayer.push({
                id: playerInfo.id,
                name: playerInfo.ign,
                fullName: playerInfo.name,
                image: playerInfo.image,
                country: playerInfo.country
            })
        } else {
            parsedPlayer.push({
                id: player.id,
                name: 'Not Specify',
                fullName: 'Not Specify',
                image: 'https://csgoteamstats.herokuapp.com/static/images/unimage-player.svg',
                country: {
                    code: 'world',
                    name: 'world',
                }
            })
        }
    }
    return parsedPlayer
}

const getLastResults = async function (recent) {
    let parsedLastResults = [];
    for (const results of recent) {
        let resultInfo = await Match.findOne({
            id: results.matchID
        })
        if (resultInfo && resultInfo.status === "Match over") {
            let teamInfo = await Teams.findOne({
                id: results.enemyTeam.id
            })
            parsedLastResults.push({
                id: resultInfo.id,
                date: functions.formatDate(resultInfo.date),
                score: results.result,
                enemyTeam: {
                    id: teamInfo.id,
                    name: teamInfo.name,
                    logo: teamInfo.logo,
                }
            })
        }
    }
    return parsedLastResults
}

module.exports = function () {
    return function (req, res) {
        let id = req.params.id;
        Teams.findOne({
            id: id
        }, function (err, team) {
            if (!err) {
                let code = countryCode.byCountry(team.location)
                team.location = code ? {
                    code: code.iso2,
                    name: code.country
                } : {
                    code: 'World',
                    name: 'World'
                }
                getPlayer(team.players)
                Promise.all([getPlayer(team.players), getLastResults(team.recentResults)]).then(data => {
                    Comment.find({
                        type: 'team',
                        id: id
                    }, function (err, comments) {
                        if (!err) {
                            if (req.session.userid) {
                                User.findById(req.session.userid, function (err, user) {
                                    if (!err) {
                                        functions.parseComments(comments, user._id).then(parsedComments => {
                                            res.status(200).json({
                                                players: data[0],
                                                recentResults: data[1],
                                                team: team,
                                                fav: user.favorite.players.includes(id),
                                                comments: parsedComments
                                            })
                                        })
                                    } else {
                                        res.status(500).send('Error on server! Try again later!')
                                    }
                                })
                            } else {
                                functions.parseComments(comments).then(parsedComments => {
                                    res.status(200).json({
                                        players: data[0],
                                        recentResults: data[1],
                                        team: team,
                                        comments: parsedComments
                                    })
                                })
                            }
                        } else {
                            res.status(500).send('Error on server! Try again later!')
                        }
                    })
                })
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}