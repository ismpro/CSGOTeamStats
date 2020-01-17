const {
    formatDate
} = require('../../functions.js')
const Players = require('../../models/Players')
const Teams = require('../../models/Teams')



module.exports = function (api) {

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
                            let parsedTeam = {
                                id: team.id,
                                name: team.name,
                                logo: team.logo,
                                location: team.location,
                                facebook: team.facebook,
                                twitter: team.twitter,
                                rank: team.rank,
                                players: team.players,
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
        let days1month = today.setMonth(today.getMonth() - 1)
        try {
            let parsedRanking = []
            let ranking = await api.fetchPlayerRanking(formatDate(today), formatDate(days1month), 'Top10', 'BigEvents')

            for (const rankPlayer of ranking) {
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
            res.status(200).json(parsedRanking)
        } catch (error) {
            console.log(error)
            res.status(500).send('Server Error')
        }
    }
}