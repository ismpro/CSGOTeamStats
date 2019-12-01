const fetch = require('node-fetch')
const schedule = require('node-schedule')
const functions = require('../functions.js')
const chalk = require('chalk')
const Teams = require('../models/Teams')

class ApiControler {
    constructor(init) {
        this.api_key = init.api_key
        this.endpoint = init.endpoint || 'https://api.pandascore.co/'
        this.game = init.game || 'csgo'
        this.maxRequest = init.maxRequest || 1000
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
            hasNext: headers.link[0].includes('rel="next"')
        }
    }

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