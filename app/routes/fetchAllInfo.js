const ApiControler = require('../config/ApiControler');
const Teams = require('../models/Team')
const Players = require('../models/Player')
const Match = require('../models/Match')

/**
 * Module that helps you fetching all the information from the results page.
 * In the url query is expeted the correct access pin and the number of pages.
 * This is deprecated, dont use this, the program will do it automatically for you.
 * @module Fetch_All_Info
 * @deprecated
 * @param {*} app The Express app
 * @param {ApiControler} api The api controller
 * @returns {Function}
 */
module.exports = function (app, api) {
    return async function (req, res) {
        let pin = req.query.pin;
        let pages = req.query.pages;
        if (app.get('pin') === pin) {
            console.warn('Deprecated: Fetch_All_Info -> The program will do this automatic for you!')
            res.status(200).send('Starting to reset')
            try {
                await api.fetchAllInfo(pages)
            } catch (error) {
                console.log(error.message)
            }
        } else {
            res.status(403).send('Unauthorized')
        }
    }
}