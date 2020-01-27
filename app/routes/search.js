const Teams = require('../models/Team');
const Players = require('../models/Player');

module.exports = function () {
    return function (req, res) {
        let data = req.body;
        let teamsPromise = Teams.find({
            name: {
                '$regex': `^${data.text}`,
                '$options': 'i'
            }
        }).limit(3).exec()
        let playerPromise = Players.find({
            $or: [{
                name: {
                    '$regex': `^${data.text}`,
                    '$options': 'i'
                }
            }, {
                ign: {
                    '$regex': `^${data.text}`,
                    '$options': 'i'
                }
            }]
        }).limit(3).exec()
        Promise.all([teamsPromise, playerPromise]).then(data => {
            let players = data[1];
            let teams = data[0];
            res.status(200).send({
                teams: teams.map((team) => ({
                    id: team.id,
                    name: team.name,
                    logo: team.logo,
                })),
                players: players.map((player) => ({
                    id: player.id,
                    ign: player.ign,
                    name: player.name,
                    image: player.image,
                    team: player.team,
                }))
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
    }
}