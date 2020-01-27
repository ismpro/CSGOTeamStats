const {
    createid
} = require('../../functions.js');
const User = require('../../models/User.js/index.js');

module.exports = function () {
    return function (req, res) {
        let ip = req.headers['x-forwarded-for'] || req.ip
        let createdSessionId = createid(64)
        let data = req.body;
        const isLocalhost = Boolean(
            ip === '[::1]' ||
            ip === '::1' ||
            ip.match(
                /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
            ) ||
            ip === '0000:0000:0000:0000:0000:0000:0000:0001'
        );
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err) {
                if (user && user.admin && user.validPassword(data.password)) {
                    req.session.userid = user._id
                    req.session.session = createdSessionId
                    user.atribuitesessionid = createdSessionId
                    let userSave = user.save()
                    let sessionSave = req.session.save()
                    Promise.all([userSave, sessionSave]).then(() => {
                        res.status(220).json({
                            name: user.firstName + ' ' + user.lastName,
                            ip: isLocalhost ? 'localhost' : ip
                        })
                    }).catch(() => {
                        res.status(500).send('Error on server! Try again later!')
                    })
                } else {
                    res.status(221).send('Unauthorized')
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        });
    }
}