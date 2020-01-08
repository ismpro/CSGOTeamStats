const Match = require('../models/Match')

module.exports = function (app, api) {
    return async function (req, res) {
        let pin = req.query.pin;
        let id = req.query.id;
        if (app.get('pin') === pin) {
            let match = await Match.findOne({
                id: id
            })
            if (match) {
                res.status(200).send('Starting to add match')
                try {
                    await api.fetchAllInfoFromMatch(id)
                    console.log('done')
                } catch (error) {
                    console.log(error.message)
                }
            } else {
                res.status(200).send('Match already in db')
            }
        } else {
            res.status(403).send('Unauthorized')
        }
    }
}