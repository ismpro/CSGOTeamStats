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
        console.log(response)
        var headers = await response.headers
        console.log(headers)
        let data = await response.json()
        return {
            data: data,
            hasNext: false
        }
    }

    async fetchAllTeams() {

        let allDat = []
        let hasNext = true
        let page = 1

        do {
            let response = await this.fetchData('teams', {
                page: page,
                per_page: 100
            })
            hasNext = response.hasNext
            page++
        }
        while (hasNext)

        console.log(allDat)
    }

    fetchOneTeamById() {

    }

    fetchOneTeamByName() {

    }
}