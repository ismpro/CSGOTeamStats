const Match = require('../models/Match')

/**
 * Module that helps you fetching all the information from a single match including teams and players.
 * In the url query is expeted the correct access pin and the id of the match.
 * This is deprecated, dont use this, the program will do it automatically for you.
 * @module Add_Match
 * @deprecated
 * @param {*} app The Express app
 * @param {*} api The api controller
 * @returns {Function}
 */
module.exports = function (app, api) {
    return async function (req, res) {
        let pin = req.query.pin;
        let id = req.query.id;
        if (true) {
            let match = await Match.findOne({
                id: id
            })
            if (!match) {
                res.status(200).send('Starting to add match')
                try {
                    await api.fetchAllInfoFromMatch(id)
                    console.log('done')
                } catch (error) {
                    console.log(error)
                }
            } else {
                res.status(200).send('Match already in database')
            }
        } else {
            res.status(403).send('Unauthorized')
        }
    }
}