const Match = require('../../../../models/Match')

module.exports = function () {
    return function (req, res) {
        Match.find({}, function (err, matches) {
            if (!err) {
                res.status(200).send(matches)
            } else {
                res.status(500).send('Server Error')
            }
        })
    }
}