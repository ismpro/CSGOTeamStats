const Teams = require('../models/Team');
const Players = require('../models/Player');
const Comment = require('../models/Comment.js/index.js');
const User = require('../models/User.js/index.js');
const Match = require('../models/Match');
const {
    formatDate,
    parseComments
} = require('../functions.js')
const {
    byCountry
} = require('country-code-lookup')

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
            api.fetchPlayerById(player.id)
                .then(player => {
                    let newPlayer = new Players(player)
                    newPlayer.save()
                    parsedPlayer.push({
                        id: newPlayer.id,
                        name: newPlayer.ign,
                        fullName: newPlayer.name,
                        image: newPlayer.image,
                        country: newPlayer.country
                    })
                }).catch(() => {
                    res.status(200).send(false)
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
                date: formatDate(resultInfo.date),
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

module.exports = function (api) {
    return function (req, res) {
        let id = req.params.id;
        Teams.findOne({
            id: id
        }, function (err, team) {
            if (!err) {
                let code = byCountry(team.location)
                team.location = code ? {
                    code: code.iso2,
                    name: code.country
                } : {
                        code: 'World',
                        name: 'World'
                    }
                Promise.all([getPlayer(team.players), getLastResults(team.recentResults)]).then(data => {
                    Comment.find({
                        type: 'team',
                        id: id
                    }, function (err, comments) {
                        if (!err) {
                            if (req.session.userid) {
                                User.findById(req.session.userid, function (err, user) {
                                    if (!err) {
                                        parseComments(comments, user._id).then(parsedComments => {
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
                                parseComments(comments).then(parsedComments => {
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