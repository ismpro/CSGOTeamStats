const Match = require('../models/Match');

module.exports = function () {
    return function (req, res) {
        let limit = req.body.limit;
        Match.find()
            .sort({ date: 'desc' })
            .limit(limit)
            .exec(function (err, docs) {
                if (!err) {
                    res.status(200).json(docs)
                } else {
                    res.status(500).send('Server Error')
                }
            });
    }
}