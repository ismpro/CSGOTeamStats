const User = require('../models/User')

/**
 * Module that sends emails from the contact route.
 * In the body is expeted data.name with the user name, data.email the user email, 
 * data.text with the content of the messages and data.check telling if the user wants a cody for himself
 * @module Email
 * @param {*} transporter The module that sends emails
 * @returns {Function}
 */
module.exports = function (transporter) {
    return function (req, res) {
        let data = req.body;
        User.find({
            admin: true
        }, function (err, users) {
            if (!err && users && users.length > 0) {
                let randIndex = Math.floor(Math.random() * users.length)
                let selecteduser = users[randIndex]
                let promiseArray = []
                let messageAdmin = {
                    from: {
                        name: 'CSGOTeamStats Noreply',
                        address: 'noreply.csgoteamstats@gmail.com'
                    },
                    to: selecteduser.email,
                    subject: "Contact from " + data.name,
                    html: '<p>Email:</p><p>' + data.email + '</p><p>Message:</p><p>' + data.text + '</p>'
                };
                promiseArray.push(transporter.sendMail(messageAdmin))
                if (data.check) {
                    let messageCopy = {
                        from: {
                            name: 'CSGOTeamStats Noreply',
                            address: 'noreply.csgoteamstats@gmail.com'
                        },
                        to: data.email,
                        subject: "Contact from " + data.name + " - Copy",
                        html: '<p>Email:</p><p>' + data.email + '</p><p>Message:</p><p>' + data.text + '</p>'
                    };

                    promiseArray.push(transporter.sendMail(messageCopy))
                }

                Promise.all(promiseArray).then(data => {
                    let accepted = data.reduce((accumulator, email) => accumulator + email.accepted.length)
                    let rejected = data.reduce((accumulator, email) => accumulator + email.rejected.length)
                    if (accepted.length >= data.length && rejected.length === 0) {
                        res.status(200).send('All emails have been sent')
                    } else if (rejected.length !== 0) {
                        res.status(200).send(`${rejected.length} have been denied`)
                    } else {
                        res.status(200).send(`Error on sending emails`)
                    }

                }).catch(err => {
                    res.status(200).send(`Error on sending emails - Err: ${err.message} `)
                })
            } else {
                res.status(500).send('Server Error')
            }
        })
    }
}