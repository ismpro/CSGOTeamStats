const schedule = require('node-schedule')
const functions = require('../functions.js')
const {
    HLTV
} = require('hltv')
const Team = require('../models/Team')
const Player = require('../models/Player')
const Match = require('../models/Match')

class ApiControler {
    constructor() {
        /* this.secheduleUpdatedJob = schedule.scheduleJob({
            hour: 0,
            minute: 1
        }, () => {
            this.updateAll();
            this.removeDuplicates();
        });
        this.secheduleFetchLastInfoJob = schedule.scheduleJob('01 * * * *', () => {
            this.fetchAllInfo(1)
            this.removeDuplicates();
        }); */
    }

    updateAll() {
        return new Promise(resolve => {
            let playersCursor = Player.find({}).cursor();
            let teamsCursor = Team.find({}).cursor();
            let playerSaved = 0
            let teamSaved = 0
            let playerUpdater = playersCursor
                .eachAsync(player => {
                    return new Promise(resolve => {
                        this.fetchPlayerById(player.id).then(newplayer => {
                            player.set(newplayer)
                            player.save(() => {
                                playerSaved++
                                console.log('\nPlayers Saved: ' + playerSaved)
                                resolve()
                            }).catch(err => resolve())
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
                        }).catch(err => resolve())
                    })
                })
            Promise.all([playerUpdater, teamUpdater]).then(() => {
                console.log('Update Complete')
                resolve()
            })
        })
    }

    async fetchAllInfoFromMatch(id) {
        await functions.sleep(2000)
        let match = await this.fetchMatchById(id)
        let mapsInfo = []
        console.log('Number Of Maps: ' + match.maps.length)
        for (const map of match.maps) {
            if (map.statsId) {
                console.log('map.statsId: ' + map.statsId)
                try {
                    await functions.sleep(2000)
                    let mapInfo = await this.fetchMatchMapStatsById(map.statsId)
                    mapsInfo.push({
                        map: mapInfo.map,
                        team1: mapInfo.team1,
                        team2: mapInfo.team2,
                        overview: mapInfo.overview,
                        playerStats: mapInfo.playerStats,
                        performanceOverview: mapInfo.performanceOverview
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        }

        let matchStats = {}
        if (mapsInfo.length > 1) {
            console.log('getting stats for match: ' + match.statsId)
            await functions.sleep(2000)
            matchStats = await this.fetchMatchesStatsById(match.statsId)
        } else {
            console.log('already have stats')
            let tempMapStats = mapsInfo[0]
            matchStats = {
                overview: tempMapStats.overview,
                playerStats: tempMapStats.playerStats
            }
        }
        let parsedMatch = {
            id: match.id,
            statsId: match.statsId,
            team1: match.team1,
            team2: match.team2,
            winnerTeam: match.winnerTeam,
            date: new Date(match.date),
            format: match.format,
            event: match.event.name,
            maps: mapsInfo.map(mapInfo => ({
                map: mapInfo.map,
                team1: mapInfo.team1,
                team2: mapInfo.team2,
                playerStats: mapInfo.playerStats,
                performanceOverview: mapInfo.performanceOverview
            })),
            players: match.players,
            status: match.status,
            title: match.title,
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
        let team1 = await Team.findOne({
            id: match.team1.id
        })
        let team2 = await Team.findOne({
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
                await functions.sleep(2000)
                console.log('Team: ' + teamsIt)
                let team = await this.fetchTeamById(id)
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
                let newTeam = new Team(parsedTeam)
                await newTeam.save()
                teams.push(parsedTeam)
            } catch (error) {
                console.log(error.message)
            }
        }
        let playersids = []
        for (const team of teams) {
            team.players.forEach(player => {
                if (player.id !== 0)
                    playersids.push(player.id)
            });
        }
        playersids = playersids.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
        let players = []
        let playersIt = 0
        for (const id of playersids) {
            let findedPlayer = await Players.findOne({
                id: id
            })
            if (!findedPlayer) {
                try {
                    playersIt++
                    await functions.sleep(2000)
                    console.log('Player: ' + playersIt)
                    let player = await this.fetchPlayerById(id)
                    let newPlayer = new Player(player)
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
        for (const id of results) {
            let foundedMatch = await Match.findOne({
                id: id
            })
            if (!foundedMatch) {
                try {
                    matchIt++
                    console.log('\nMatch: ' + matchIt)
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
            HLTV.getMatchStats({ id: id })
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

    fetchTeamRanking() {
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

    fetchPlayerRanking(startDate, endDate, matchType, rankingFilter) {
        return new Promise((resolve, reject) => {
            HLTV.getPlayerRanking({
                startDate: startDate,
                endDate: endDate,
                matchType: matchType,
                rankingFilter: rankingFilter
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    async removeDuplicates() {
        const aggTeam = Team.aggregate([
            {
                "$group": {
                    "_id": { "id": "$id" },
                    "dups": { "$push": "$_id" },
                    "count": { "$sum": 1 }
                }
            },
            { "$match": { "count": { "$gt": 1 } } }
        ]);
        for await (const doc of aggTeam) {
            Team.findByIdAndDelete(doc.dups[0], function (err, deletedTeam) {
                if (!err) {
                    console.log('Remove Duplicate:' + deletedTeam.name)
                } else {
                    console.log(err)
                }
            })
        }

        const aggPlayers = Player.aggregate([
            {
                "$group": {
                    "_id": { "id": "$id" },
                    "dups": { "$push": "$_id" },
                    "count": { "$sum": 1 }
                }
            },
            { "$match": { "count": { "$gt": 1 } } }
        ]);
        for await (const doc of aggPlayers) {
            Player.findByIdAndDelete(doc.dups[0], function (err, deletedPlayer) {
                if (!err) {
                    console.log('Remove Duplicate:' + deletedPlayer.ign)
                } else {
                    console.log(err)
                }
            })
        }

        const aggMatch = Match.aggregate([
            {
                "$group": {
                    "_id": { "id": "$id" },
                    "dups": { "$push": "$_id" },
                    "count": { "$sum": 1 }
                }
            },
            { "$match": { "count": { "$gt": 1 } } }
        ]);
        for await (const doc of aggMatch) {
            Match.findByIdAndDelete(doc.dups[0], function (err, deletedMatch) {
                if (!err) {
                    console.log('Remove Duplicate:' + deletedMatch.event)
                } else {
                    console.log(err)
                }
            })
        }
    }
}

module.exports = ApiControler