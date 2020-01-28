const Teams = require('../models/Team');
const Players = require('../models/Player');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Match = require('../models/Match');
const {
    formatDate,
    parseComments
} = require('../functions.js')
const {
    byCountry
} = require('country-code-lookup')

module.exports = function (api) {

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
                    }).catch((err) => {
                        parsedPlayer.push({
                            id: 0,
                            name: '?',
                            fullName: '?',
                            image: 'https://static.hltv.org//images/playerprofile/bodyshot/unknown.png',
                        })
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
        Teams.findOne({
            id: id
        }, function (err, team) {
            if (!err) {
                if (team) {
                    let code = byCountry(team.location)
                    team.location = code ? {
                        code: code.iso2,
                        name: code.country
                    } : {
                            code: 'World',
                            name: 'World'
                        }
                    Promise.all([getPlayer(team.players), getLastResults(team.recentResults), getComments(id, req.session.userid)]).then(data => {
                        res.status(200).json({
                            players: data[0],
                            recentResults: data[1],
                            team: team,
                            comments: data[2]
                        })
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
                        Promise.all([getPlayer(team.players), getLastResults(team.recentResults), getComments(id, req.session.userid), newTeam.save()])
                            .then(data => {
                                res.status(200).json({
                                    players: data[0],
                                    recentResults: data[1],
                                    team: team,
                                    comments: data[2]
                                })
                            })
                            .catch(err => {
                                res.status(500).send(err)
                            })
                    }).catch(() => {
                        res.status(200).json(false)
                    })
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}