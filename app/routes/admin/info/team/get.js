const Team = require('../../../../models/Team')

/**
 * Returns all the Teams
 * @module Admin/Team/Get
 * @deprecated
 */
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