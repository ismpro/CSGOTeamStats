const Match = require('./models/Match')

module.exports = function () {
    return function (req, res) {
        let id = req.params.id;
        Match.findOne({
            id: id
        }, function (err, match) {
            if (!err) {
                res.status(200).json(match)
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    }
}