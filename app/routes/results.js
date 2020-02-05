const Match = require('../models/Match');

/**
 * Module that deals with search request. 
 * In the body is expeted an limit then returns all the matches within that limit.
 * @module Results
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        let limit = req.body.limit || 0;
        let skip = req.body.skip || 0;
        Match.find()
            .sort({
                date: 'desc'
            })
            .skip(skip)
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