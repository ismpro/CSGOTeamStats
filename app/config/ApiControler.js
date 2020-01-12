const schedule = require('node-schedule')
const functions = require('../functions.js')
const chalk = require('chalk')
const {
    HLTV
} = require('hltv')
const Teams = require('../models/Teams')
const Players = require('../models/Players')
const Match = require('../models/Match')

class ApiControler {
    constructor() {
        this.secheduleUpdatedJob = schedule.scheduleJob({
            hour: 21,
            minute: 13
        }, () => {
            this.updateAll()
        });
        this.secheduleFetchLastInfoJob = schedule.scheduleJob('01 * * * *', () => {
            this.fetchAllInfo(1)
        });
    }

    updateAll() {
        return new Promise(resolve => {
            let playersCursor = Players.find({}).cursor();
            let teamsCursor = Teams.find({}).cursor();
            let matchCursor = Match.find({}).cursor();
            let playerSaved = 0
            let teamSaved = 0
            let matchSaved = 0
            let playerUpdater = playersCursor
                .eachAsync(player => {
                    return new Promise(resolve => {
                        this.fetchPlayerById(player.id).then(newplayer => {
                            player.set(newplayer)
                            player.save(() => {
                                playerSaved++
                                console.log('\nPlayers Saved: ' + playerSaved)
                                resolve()
                            })
                        })
                    })
                })
                .then(() => console.log('Players all updated'));
            let teamUpdater = teamsCursor
                .eachAsync(team => {
                    return new Promise(resolve => {
                        this.fetchTeamById(team.id).then(newTeam => {
                            team.set(newTeam)
                            team.save(() => {
                                teamSaved++
                                console.log('\nTeams Saved: ' + teamSaved)
                                resolve()
                            })
                        })
                    })
                })
            let matchUpdater = matchCursor
                .eachAsync(match => {
                    return new Promise(resolve => {
                        Promise.all([this.fetchMatchById(match.id), this.fetchMatchesStatsById(match.statsId)]).then(data => {
                            let match = data[0]
                            let matchStats = data[1]
                            let parsedMatch = {
                                id: match.id,
                                statsId: match.statsId,
                                team1: match.team1,
                                team2: match.team2,
                                winnerTeam: match.winnerTeam,
                                date: new Date(match.date),
                                format: match.format,
                                additionalInfo: match.additionalInfo,
                                event: match.event.name,
                                maps: match.maps,
                                players: match.players,
                                streams: match.streams,
                                live: match.live,
                                status: match.status,
                                title: match.title,
                                hasScorebot: match.hasScorebot,
                                highlightedPlayer: match.highlightedPlayer,
                                vetoes: match.vetoes,
                                highlights: match.highlights,
                                demos: match.demos,
                                overview: {
                                    mostKills: matchStats.overview.mostKills,
                                    mostDamage: matchStats.overview.mostDamage,
                                    mostAssists: matchStats.overview.mostAssists,
                                    mostAWPKills: matchStats.overview.mostAWPKills,
                                    mostFirstKills: matchStats.overview.mostFirstKills,
                                    bestRating: matchStats.overview.bestRating
                                },
                                playerStats: matchStats.playerStats
                            }
                            match.set(parsedMatch)
                            match.save(() => {
                                matchSaved++
                                console.log('\nMatches Saved: ' + matchSaved)
                                resolve()
                            })
                        })
                    })
                })
            Promise.all([playerUpdater, teamUpdater, matchUpdater]).then(() => {
                console.log('Update Complete')
                resolve()
            })
        })
    }

    async fetchAllInfoFromMatch(id) {
        let match = await this.fetchMatchById(id)
        let matchStats = await this.fetchMatchesStatsById(match.statsId)
        let parsedMatch = {
            id: match.id,
            statsId: match.statsId,
            team1: match.team1,
            team2: match.team2,
            winnerTeam: match.winnerTeam,
            date: new Date(match.date),
            format: match.format,
            additionalInfo: match.additionalInfo,
            event: match.event.name,
            maps: match.maps,
            players: match.players,
            streams: match.streams,
            live: match.live,
            status: match.status,
            title: match.title,
            hasScorebot: match.hasScorebot,
            highlightedPlayer: match.highlightedPlayer,
            vetoes: match.vetoes,
            highlights: match.highlights,
            demos: match.demos,
            overview: {
                mostKills: matchStats.overview.mostKills,
                mostDamage: matchStats.overview.mostDamage,
                mostAssists: matchStats.overview.mostAssists,
                mostAWPKills: matchStats.overview.mostAWPKills,
                mostFirstKills: matchStats.overview.mostFirstKills,
                bestRating: matchStats.overview.bestRating
            },
            playerStats: matchStats.playerStats
        }
        let newMatch = new Match(parsedMatch)
        await newMatch.save()
        let teamids = []
        let team1 = await Teams.findOne({
            id: match.team1.id
        })
        let team2 = await Teams.findOne({
            id: match.team2.id
        })

        if (!team1) {
            teamids.push(match.team1.id)
        }
        if (!team2) {
            teamids.push(match.team2.id)
        }

        teamids = teamids.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
        let teams = []
        let teamsIt = 0
        let teamsCount = 0
        for (const id of teamids) {
            try {
                teamsIt++
                teamsCount++
                if (teamsCount === 3) {
                    await functions.sleep(3000)
                    teamsCount = 0
                }
                console.log('Team: ' + teamsIt)
                let team1 = await this.fetchTeamById(id)
                let parsedTeam = {
                    id: team1.id,
                    name: team1.name,
                    logo: team1.logo,
                    location: team1.location,
                    facebook: team1.facebook,
                    twitter: team1.twitter,
                    rank: team1.rank,
                    players: team1.players,
                    recentResults: team1.recentResults
                }
                let newTeam = new Teams(parsedTeam)
                await newTeam.save()
                teams.push(parsedTeam)
            } catch (error) {
                console.log(error.message)
            }
        }
        let playersids = []
        for (const team of teams) {
            team.players.forEach(player => {
                playersids.push(player.id)
            });
        }
        playersids = playersids.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
        let players = []
        let playersIt = 0
        let playersCount = 0
        for (const id of playersids) {
            let findedPlayer = await Players.findOne({ id: id })
            if (!findedPlayer) {
                try {
                    playersIt++
                    playersCount++
                    if (playersCount === 3) {
                        await functions.sleep(3000)
                        playersCount = 0
                    }
                    console.log('Player: ' + playersIt)
                    let player = await this.fetchPlayerById(id)
                    let newPlayer = new Players(player)
                    await newPlayer.save()
                    players.push(player)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
        return {
            match: parsedMatch,
            teams: teams,
            players: players
        }

    }

    async fetchAllInfo(pages) {
        let results = await this.fetchResultsByPages(pages)
        results = results.map(result => result.id)
        let info = []
        let matchIt = 0
        let matchCount = 0
        for (const id of results) {
            let foundedMatch = Match.findOne({ id: id })
            if (!foundedMatch) {
                try {
                    matchIt++
                    matchCount++
                    if (matchCount === 3) {
                        await functions.sleep(3000)
                        matchCount = 0
                    }
                    console.log('Match: ' + matchIt)
                    let infoAll = await this.fetchAllInfoFromMatch(id)
                    info.push(infoAll)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
        return info
    }

    fetchPlayerById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getPlayer({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchTeamById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getTeam({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchTeamStatsById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getTeamStats({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchResultsByPages(pages) {
        return new Promise((resolve, reject) => {
            HLTV.getResults({
                pages: pages
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchMatchById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatch({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchMatchesStatsById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatchStats({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchMatchesStatsByDates(startDate, endDate) {
        return new Promise((resolve, reject) => {
            HLTV.getMatchesStats({
                startDate: functions.formatDate(startDate),
                endDate: functions.formatDate(endDate)
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchMatchMapStatsById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatchMapStats({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchRanking() {
        return new Promise((resolve, reject) => {
            HLTV.getTeamRanking()
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    fetchRankingByCountry(country) {
        return new Promise((resolve, reject) => {
            HLTV.getTeamRanking({
                country: country
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}

module.exports = ApiControler