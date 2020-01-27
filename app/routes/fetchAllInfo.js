const Teams = require('../models/Team')
const Players = require('../models/Player')
const Match = require('../models/Match')

module.exports = function (app, api) {
    return async function (req, res) {
        let pin = req.query.pin;
        let pages = req.query.pages;
        if (app.get('pin') === pin) {
            res.status(200).send('Starting to reset')
            try {
                await Teams.deleteMany({})
                await Players.deleteMany({})
                await Match.deleteMany({})

                await api.fetchAllInfo(pages)

            } catch (error) {
                console.log(error.message)
            }
        } else {
            res.status(403).send('Unauthorized')
        }
    }
}