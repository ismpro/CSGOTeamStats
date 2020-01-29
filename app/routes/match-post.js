const Match = require('../models/Match');
const Players = require('../models/Player');
const {
    byCountry
} = require('country-code-lookup')

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
            parsedPlayer.push({
                id: player.id,
                name: 'Not Specify',
                fullName: 'Not Specify',
                image: 'https://csgoteamstats.herokuapp.com/static/images/unimage-player.svg',
                country: {
                    code: 'world',
                    name: 'world',
                }
            })
        }
    }
    return parsedPlayer
}

module.exports = function (api) {
    return function (req, res) {
        let id = req.params.id;
        Match.findOne({
            id: id
        }, function (err, match) {
            if (!err) {
                //res.status(200).json(match)                
                Promise.all([getPlayers(match.players.team1), getPlayers(match.players.team2)]).then(data => {
                    res.status(200).json({
                        match: match,
                        playersTeam1: data[0],
                        playersTeam2: data[1]
                    })
                })
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}