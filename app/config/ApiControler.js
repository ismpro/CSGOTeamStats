const fetch = require('node-fetch')
const schedule = require('node-schedule')
// eslint-disable-next-line no-unused-vars
const functions = require('../functions.js')
const chalk = require('chalk')
const Teams = require('../models/Teams')

class ApiControler {
    constructor(init) {
        this.api_key = init.api_key
        this.endpoint = 'https://api.pandascore.co/'
        this.game = 'csgo'
        this.maxRequest = 1000
        this.currentHeaders = {
            currentRequestCount: 0,
            remainingRequest: this.maxRequest
        }
        this.secheduleJob = schedule.scheduleJob('00 * * * *', () => {
            this.currentHeaders = {
                currentRequestCount: 0,
                remainingRequest: this.maxRequest
            }
            console.log(chalk.red('Headers Reseted'))
        });
    }

    /**
     * Fetched data from the api
     * @param {String} link 
     * @param {Object} parameters 
     */
    async fetchData(link, parameters) {
        let strParameters = "";
        if (parameters) {
            strParameters += '?';
            for (let key in parameters) {
                if (strParameters != "?") {
                    strParameters += "&";
                }
                strParameters += key + "=" + encodeURIComponent(parameters[key]);
            }
        }
        let response = await fetch(`${this.endpoint}${this.game}/${link}${strParameters}`, {
            headers: {
                Authorization: `Bearer ${this.api_key}`
            }
        })
        const headers = await response.headers[Object.getOwnPropertySymbols(response.headers)[0]]
        let data = await response.json()
        this.currentHeaders = {
            currentRequestCount: parseInt(headers['x-rate-limit-remaining'][0]),
            remainingRequest: parseInt(headers['x-rate-limit-used'][0])
        }
        return {
            data: data,
            hasNext: /* false */ headers.link[0].includes('rel="next"')
        }
    }

    /**
     * 
     * @param {*} link 
     */
    async fetchAllData(link) {
        let allDat = []
        let hasNext = true
        let page = 1
        do {
            let response = await this.fetchData(link, {
                page: page,
                per_page: 100
            })
            hasNext = response.hasNext
            page++
            let data = response.data
            allDat = allDat.concat(data)
        }
        while (hasNext)
        return allDat
    }

    fetchAllMatches() {
        return new Promise((resolve, reject) => {
            this.fetchAllData('matches').then(data => {
                Teams.find({}, (err, teams) => {
                    if (!err) {
                        let parsedData = data.map(match => {
                            let winnerTeam = teams.find(team => team.apiId === match.winner_id)
                            return {
                                name: match.name,
                                begin: match.begin_at,
                                isDetailed: match.detailed_stats,
                                draw: match.draw,
                                end: match.end_at,
                                forfeit: match.forfeit,
                                games: match.games.map((game) => {
                                    return {
                                        begin: game.begin_at,
                                        isDetailed: game.detailed_stats,
                                        end: game.end_at,
                                        finished: game.finished,
                                        forfeit: game.forfeit,
                                        id: game.id,
                                        length: game.length,
                                        position: game.position,
                                        status: game.status,
                                        video_url: game.video_url,
                                        winner: teams.find(t => t.apiId === game.winner.id)
                                    }
                                }),
                                apiId: match.id,
                                league: {
                                    apiId: match.league.id,
                                    image_url: match.league.image_url,
                                    name: match.league.name,
                                    slug: match.league.slug,
                                    url: match.league.url
                                },
                                live: {
                                    opens_at: match.live.opens_at,
                                    supported: match.live.supported,
                                    url: match.live_url
                                },
                                match_type: match.match_type,
                                modified: match.modified_at,
                                number_of_games: match.number_of_games,
                                opponents: match.opponents.map((opponent) => {
                                    if (opponent.type === "Team") {
                                        let team = teams.find(team => team.apiId === opponent.opponent.id);
                                        if (team) {
                                            return team._id
                                        }
                                    }
                                    return null
                                }),
                                results: match.results.map((result) => {
                                    let team = teams.find(team => team.apiId === result.team_id);
                                    if (team) {
                                        return {
                                            score: result.score,
                                            team: team._id
                                        }
                                    }
                                    return null
                                }),
                                scheduled_at: match.scheduled_at,
                                serie: {
                                    begin: match.serie.begin_at,
                                    description: match.serie.description,
                                    end: match.serie.end_at,
                                    full_name: match.serie.full_name,
                                    id: match.serie.id,
                                    modified: match.serie.modified_at,
                                    name: match.serie.name,
                                    slug: match.serie.slug,
                                    winner_id: match.serie.winner_id,
                                    winner_type: match.serie.winner_type,
                                    year: match.serie.year
                                },
                                serie_id: match.serie_id,
                                slug: match.slug,
                                status: match.status,
                                tournament: {
                                    begin: match.tournament.begin_at,
                                    end: match.tournament.end_at,
                                    id: match.tournament.id,
                                    live_supported: match.tournament.live_supported,
                                    modified: match.tournament.modified_at,
                                    name: match.tournament.name,
                                    prizepool: match.tournament.prizepool,
                                    slug: match.tournament.slug,
                                },
                                winner: winnerTeam ? winnerTeam._id : null
                            }
                        })
                        resolve(parsedData)
                    } else {
                        reject(err)
                    }
                })
            }).catch(err => reject(err))
        })
    }

    fetchAllPlayers() {
        return new Promise((resolve, reject) => {
            this.fetchAllData('players').then(data => {
                Teams.find({}, (err, teams) => {
                    if (!err) {
                        let parsedData = data.map(player => {
                            if (player.current_team) {
                                let team = teams.find(team => team.apiId === player.current_team.id);
                                if (team) {
                                    return {
                                        name: player.name,
                                        first_name: player.first_name,
                                        last_name: player.last_name,
                                        hometown: player.hometown,
                                        apiId: player.id,
                                        image_url: player.image_url,
                                        role: player.role,
                                        slug: player.slug,
                                        team: team._id
                                    }
                                }
                            }
                            return {
                                name: player.name,
                                first_name: player.first_name,
                                last_name: player.last_name,
                                hometown: player.hometown,
                                apiId: player.id,
                                image_url: player.image_url,
                                role: player.role,
                                slug: player.slug,
                                team: null
                            }
                        })
                        resolve(parsedData)
                    } else {
                        reject(err)
                    }
                })
            }).catch(err => reject(err))
        })
    }

    fetchAllTeams() {
        return new Promise((resolve, reject) => {
            this.fetchAllData('teams').then(data => {
                let parsedData = data.map(team => {
                    return {
                        name: team.name,
                        acronym: team.acronym,
                        apiId: team.id,
                        image_url: team.image_url,
                        slug: team.slug
                    }
                })
                resolve(parsedData)
            }).catch(err => reject(err))
        })
    }

    fetchOneTeamById() {

    }

    fetchOneTeamByName() {

    }
}

module.exports = ApiControler