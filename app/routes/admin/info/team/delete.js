const Team = require('../../../../models/Team')

module.exports = function () {
    return function (req, res) {
        let id = req.body.id;
        Team.findByIdAndDelete(id, function (err, deletedTeam) {
            if (!err) {
                res.status(200).send(deletedTeam.name)
            } else {
                res.status(500).send('Error on server')
            }
        })
    }
}