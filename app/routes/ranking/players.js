// @ts-nocheck
const {
    formatDate
} = require('../../functions.js')
const Players = require('../../models/Player')
const Teams = require('../../models/Team')

/**
 * Module that deals with the information of current ranking of players.
 * If the ids doens't existis in the Database then is going to search in the api.
 * @module Ranking/Players
 * @async
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
    const getTeam = async (id) => {
        return new Promise((resolve, reject) => {
            Teams.findOne({
                id: id
            }, function (err, team) {
                if (!err) {
                    if (team) {
                        resolve({
                            id: team.id,
                            name: team.name,
                            logo: team.logo,
                        })
                    } else {
                        api.fetchTeamById(id).then(team => {
                            if (team.players && Array.isArray(team.players) && team.players.length < 5) {
                                for (let index = team.players.length + 1; index >= 5; index++) {
                                    team.players.length[index] = {
                                        id: 0,
                                        name: ''
                                    }
                                }
                            }
                            let parsedTeam = {
                                id: team.id,
                                name: team.name,
                                logo: team.logo,
                                location: team.location,
                                facebook: team.facebook,
                                twitter: team.twitter,
                                rank: team.rank,
                                players: team.players.map(player => ({
                                    id: Number.isNaN(player.id) ? 0 : player.id,
                                    name: player.name || ''
                                })),
                                recentResults: team.recentResults
                            }
                            let newTeam = new Teams(parsedTeam)
                            newTeam.save()
                            resolve({
                                id: parsedTeam.id,
                                name: parsedTeam.name,
                                logo: parsedTeam.logo,
                            })
                        })
                    }
                } else {
                    console.log(err)
                    reject(err)
                }
            })
        })
    }

    return async function (req, res) {
        let today = new Date()
        let before = new Date()
        before.setMonth(before.getMonth() - 6)
        try {
            let parsedRanking = []
            let ranking = await api.fetchPlayerRanking(formatDate(before), formatDate(today), 'Majors', 'Top10')
            let index = 0; //Sometimes hltv returns more than 10 players 
            for (const rankPlayer of ranking) {
                if (index < 10) {
                    let player = await Players.findOne({
                        id: rankPlayer.id
                    })
                    if (player) {
                        if (player.team) {
                            let team = await getTeam(player.team.id)
                            parsedRanking.push({
                                id: player.id,
                                ign: player.ign,
                                image: player.image,
                                team: team,
                            })
                        } else {
                            parsedRanking.push({
                                id: player.id,
                                ign: player.ign,
                                image: player.image,
                                team: null,
                            })
                        }
                    } else {
                        let newP = await api.fetchPlayerById(rankPlayer.id)
                        if (newP) {
                            let newPlayer = new Players(newP)
                            await newPlayer.save()
                            if (newP.team) {
                                let team = await getTeam(newP.team.id)
                                parsedRanking.push({
                                    id: newP.id,
                                    ign: newP.ign,
                                    image: newP.image,
                                    team: team,
                                })
                            } else {
                                parsedRanking.push({
                                    id: newP.id,
                                    ign: newP.ign,
                                    image: newP.image,
                                    team: null,
                                })
                            }
                        } else {
                            parsedRanking.push(null)
                        }
                    }
                }
                index++
            }
            res.status(200).json(parsedRanking)
        } catch (error) {
            console.log(error)
            res.status(500).send('Server Error')
        }
    }
}