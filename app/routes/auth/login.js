const User = require('../../models/Users.js');
const {
    createid
} = require('../../functions.js');

module.exports = function () {
    return function (req, res) {
        let data = req.body;
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err) {
                if (user) {
                    if (user.validPassword(data.password)) {
                        let sessionId = createid(64)
                        req.session.userid = user._id
                        req.session.sessionId = sessionId
                        user.atribuitesessionid = sessionId
                        let userSave = user.save()
                        let sessionSave = req.session.save()
                        Promise.all([userSave, sessionSave]).then(() => {
                            res.status(220).send('/')
                        }).catch(() => {
                            res.status(500).send('Error on server! Try again later!')
                        })
                    } else {
                        res.status(221).send('Email or password invalid')
                    }
                } else {
                    res.status(221).send('Email or password invalid')
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        });
    }
}