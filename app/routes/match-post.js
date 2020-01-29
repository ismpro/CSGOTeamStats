// @ts-nocheck
const Match = require('../models/Match');
const Players = require('../models/Player');
const {
    byCountry
} = require('country-code-lookup')

/**
 * Module that deals with the information of a team post request.
 * In the url is expeted an id (/:id) then returns all the information of that player.
 * If the id doens't existis in the Database then is going to search in the api.
 * @module Match_Post
 * @param {ApiControler} api The api controller
 * @returns {Function}
 */
module.exports = function (api) {

    /**
     * Function that deals with the information of all players.
     * If the players doens't existis in the Database then is going to search in the api.
     * @async
     * @param {Array<{name: String, id: Number}>} players Array with players information
     * @returns {Promise<Array<{id: Number, name: String, fullName: String, image: String, country: Object}>>}
     */
    const getPlayers = async function (players) {
        let parsedPlayer = [];
        for (const player of players) {
            let playerInfo = await Players.findOne({
                id: player.id
            })
            if (playerInfo) {
                parsedPlayer.push({
                    id: playerInfo.id,
                    name: playerInfo.ign,
                    fullName: playerInfo.name,
                    image: playerInfo.image,
                    country: playerInfo.country
                })
            } else {
                api.fetchPlayerById(player.id)
                    .then(player => {
                        let newPlayer = new Players(player)
                        newPlayer.save()
                        parsedPlayer.push({
                            id: newPlayer.id,
                            name: newPlayer.ign,
                            fullName: newPlayer.name,
                            image: newPlayer.image,
                            country: newPlayer.country
                        })
                    }).catch((err) => {
                        parsedPlayer.push({
                            id: 0,
                            name: '?',
                            fullName: '?',
                            image: 'https://static.hltv.org//images/playerprofile/bodyshot/unknown.png',
                        })
                    })
            }
        }
        return parsedPlayer
    }

    /**
     * Function return the parsed comments or an empty [].
     * @param {number} id The id of the Player
     * @param {String} [user_id] The id of the User 
     * @returns {Promise<Array>}
     */
    const getComments = (id, user_id) => {
        return new Promise((resolve, reject) => {
            console.log(user_id)
            Comment.find({
                type: 'match',
                id: id
            }, function (err, comments) {
                if (!err) {
                    parseComments(comments, user_id)
                        .then(parsedComments => resolve(parsedComments))
                        .catch(err => reject(err.message))
                } else {
                    reject(err.message)
                }
            })
        })
    }

    return function (req, res) {
        let id = req.params.id;
        Match.findOne({
            id: id
        }, function (err, match) {
            if (!err) {
                Promise.all([getPlayers(match.players.team1), getPlayers(match.players.team2)], getComments(id, req.session.userid)).then(data => {
                    res.status(200).json({
                        match: match,
                        playersTeam1: data[0],
                        playersTeam2: data[1],
                        comments: data[2]
                    })
                })
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}