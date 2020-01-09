const Team = require('../../../../models/Teams')

module.exports = function () {
    return function (req, res) {
        Team.find({}, function (err, teams) {
            if (!err) {
                res.status(200).send(teams)
            } else {
                res.status(500).send('Server Error')
            }
        })
    }
}