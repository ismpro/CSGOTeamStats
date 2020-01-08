const User = require('../../models/Users.js');

module.exports = function () {
    return function (req, res) {
        let data = req.body;
        User.findOne({
            email: data.email
        }, function (err, user) {
            if (!err) {
                if (!user) {
                    let newUser = new User();
                    newUser.email = data.email;
                    newUser.firstName = data.firstName
                    newUser.lastName = data.lastName
                    newUser.password = newUser.generateHash(data.password);
                    newUser.creationDate = new Date();
                    newUser.admin = false;
                    newUser.atribuitesessionid = 'expired';
                    newUser.save(function (err, user) {
                        if (!err && user) {
                            res.status(230).send(true);
                        } else {
                            console.log(err)
                            res.status(500).send('Error on resgisting on server');
                        }
                    });
                } else {
                    res.status(231).send('Email already in use!');
                }
            } else {
                res.status(231).send('Email already in use!');
            }
        });
    }
}