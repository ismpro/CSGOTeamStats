const fetch = require('node-fetch')
const schedule = require('node-schedule')
const chalk = require('chalk')

exports.ApiControler = class {
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

    fetchAllTeams() {
        let response = await fetch("https://api.fitbit.com/oauth2/token", {
            body: `clientId=${this.clientId}&grant_type=authorization_code&redirect_uri=${encodeURI(this.callBackURL)}&code=${code}`,
            headers: {
                Authorization: `Bearer ${this.api_key}`
            },
            method: "GET"
        })
        let data = await response.json()
        return data
    }

    fetchOneTeamById() {

    }

    fetchOneTeamByName() {

    }
}