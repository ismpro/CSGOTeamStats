const Teams = require('../models/Teams.js');
const Players = require('../models/Players.js');

module.exports = function () {
    return function (req, res) {
        let data = req.body;
        console.log(data)
        let teamsPromise = Teams.find({
            name: {
                '$regex': `^${data.text}`,
                '$options': 'i'
            }
        })
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
        })
        Promise.all([teamsPromise, playerPromise]).then(data => {
            res.status(200).send({
                teams: data[0],
                players: data[1]
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
    }
}