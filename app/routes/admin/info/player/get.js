const Player = require('../../../../models/Player')

module.exports = function () {
    return function (req, res) {
        Player.find({}, function (err, players) {
            if (!err) {
                res.status(200).send(players)
            } else {
                res.status(500).send('Server Error')
            }
        })
    }
}