const schedule = require('node-schedule')
const functions = require('../functions.js')
const {
    HLTV
} = require('hltv')
const Team = require('../models/Team')
const Player = require('../models/Player')
const Match = require('../models/Match')

/**
 * Class thats helps with HLTV api by extracting information from HLTV and schedules jobs for updates and new matches.
 */
class ApiControler {
    constructor() {
        /**
         * @property {object} secheduleUpdatedJob Object that has timer information about updates
         * Fires every day at 00:01
         */
        this.secheduleUpdatedJob = schedule.scheduleJob({
            hour: 0,
            minute: 1
        }, () => {
            this.updateAll().then(() => {
                this.removeDuplicates();
            });

        });
        /**
         * @property {object} secheduleFetchLastInfoJob Object that has timer information about new Matches
         * Fires every hour
         */
        this.secheduleFetchLastInfoJob = schedule.scheduleJob('01 * * * *', () => {
            this.fetchAllInfo(1).then(() => {
                this.removeDuplicates();
            });
        });
    }

    /**
     * Returns the information of all content from match including teams and players and saves also saves to database that information.
     * 
     * @returns {Promise<void>}
     */
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
                            // @ts-ignore
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
                        // @ts-ignore
                        }).catch(err => resolve())
                    })
                })
            Promise.all([playerUpdater, teamUpdater]).then(() => {
                console.log('Update Complete')
                resolve()
            })
        })
    }

    /**
     * Returns the information of all content from a single match including teams and players and saves also saves to database that information.
     * WARNING: this take a long time!
     * @async
     * @param {Number} id The id of the match
     * @returns {Promise<{match: Object,teams: Object,players: Object}>}
     */
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
            vetoes: match.vetoes.map(veto => ({
                map: veto.map,
                team: { name: veto.team.name, id: veto.team.id },
                type: veto.type
            })),
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
        // @ts-ignore
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
            let findedPlayer = await Player.findOne({
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

    /**
     * Returns the information of all content from all the matches from a results page including teams and players and saves also saves to database that information.
     * WARNING: this take a long time!
     * @async
     * @param {Number} pages How pages do you want from (1 = 100 matches)
     * @see {@link https://www.hltv.org/results|HLTV Results Page}
     * @returns {Promise<Array<{match: Object,teams: Object,players: Object}>>}
     */
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

    /**
     * Returns all information from a single player
     * @param {Number} id ID of the player
     * @returns {Promise<Object>}
     */
    fetchPlayerById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getPlayer({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns all information from a single team
     * @param {Number} id ID of the team
     * @returns {Promise<Object>}
     */
    fetchTeamById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getTeam({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns all matches from the the results page
     * @param {Number} pages How pages do you want from (1 = 100 matches)
     * @see {@link https://www.hltv.org/results | HLTV Results Page}
     * @returns {Promise<Object>}
     */
    fetchResultsByPages(pages) {
        return new Promise((resolve, reject) => {
            HLTV.getResults({
                pages: pages
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns all information from a single match
     * @param {Number} id ID of the match
     * @returns {Promise<Object>}
     */
    fetchMatchById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatch({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns all stats information from a single match
     * @param {Number} id ID of the stats match (not the same as match ID)
     * @returns {Promise<Object>}
     */
    fetchMatchesStatsById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatchStats({ id: id })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns all stats information from a single map
     * @param {Number} id ID of the stats map (not the same as match ID)
     * @returns {Promise<Object>}
     */
    fetchMatchMapStatsById(id) {
        return new Promise((resolve, reject) => {
            HLTV.getMatchMapStats({
                id: id
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Returns the players rank
     * @param {String} startDate Start Date of the rank (format yyyy-mm-dd)
     * @param {String} endDate End Date of the rank (format yyyy-mm-dd)
     * @param {('Lan'|'Online'|'BigEvents'|'Majors')} matchType What type of matches that the ranking is going to be based on
     * @param {('Top5'|'Top10'|'Top20'|'Top30'|'Top50')} rankingFilter The number of player that you want to be returned
     * @returns {Promise<Object>}
     */
    fetchPlayerRanking(startDate, endDate, matchType, rankingFilter) {
        return new Promise((resolve, reject) => {
            HLTV.getPlayerRanking({
                startDate: startDate,
                endDate: endDate,
                // @ts-ignore
                matchType: matchType,
                // @ts-ignore
                rankingFilter: rankingFilter
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    /**
     * Removes all duplicates from the data base
     * @async
     * @returns {Promise<void>}
     */
    async removeDuplicates() {
        const aggTeam = await Team.aggregate([
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
                    // @ts-ignore
                    console.log('Remove Duplicate: ' + deletedTeam.name)
                } else {
                    console.log(err)
                }
            })
        }

        const aggPlayers = await Player.aggregate([
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
                    // @ts-ignore
                    console.log('Remove Duplicate: ' + deletedPlayer.ign)
                } else {
                    console.log(err)
                }
            })
        }

        const aggMatch = await Match.aggregate([
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
                    // @ts-ignore
                    console.log('Remove Duplicate: ' + deletedMatch.event)
                } else {
                    console.log(err)
                }
            })
        }
    }
}

module.exports = ApiControler