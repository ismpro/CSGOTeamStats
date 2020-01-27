const {
    createid
} = require('../../functions.js');
const User = require('../../models/User.js/index.js');
const Link = require('../../models/Link.js/index.js');

module.exports = function (transporter) {
    return function (req, res) {
        let data = req.body
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err) {
                if (user) {
                    if (typeof user.admin === 'boolean' && user.admin) {
                        res.status(241).send('You are already an admin')
                    } else if (typeof user.admin === 'string' && user.admin === 'processing') {
                        res.status(241).send('Your request is being process')
                    } else if (typeof user.admin === 'string' && user.admin === 'ban') {
                        res.status(241).send('Your email is ban from the program')
                    } else {
                        let createLink = createid(124)
                        let message = {
                            from: {
                                name: 'CSGOTeamStats Noreply',
                                address: 'noreply.csgoteamstats@gmail.com'
                            },
                            to: 'ismaelourenco@msn.com',
                            subject: "New admin request",
                            html: '<table><tbody><tr><td>Id:</td><td>' + user._id + '</td></tr> \
                                <tr><td>Nome:</td><td>' + user.firstName + ' ' + user.lastName + '</td></tr> \
                                <tr><td>Email:</td><td>' + user.email + '</td></tr> \
                                </tbody></table> \
                                <a href="https://csgoteamstats.herokuapp.com/admin/program/' + createLink + '?type=accept">Accept</a>  \
                                <a href= "https://csgoteamstats.herokuapp.com/admin/program/' + createLink + '?type=deny">Deny</a>'
                        };
                        transporter.sendMail(message, (err) => {
                            if (!err) {
                                user.admin = 'processing';
                                user.save((err) => {
                                    if (!err) {
                                        let d = new Date()
                                        let expire = d.setDate(d.getDate() + 1)
                                        let link = new Link({
                                            link: createLink,
                                            type: 'adminprogram',
                                            state: 'beginning',
                                            user: user._id,
                                            expireDate: expire
                                        })
                                        link.save(err => {
                                            if (!err) {
                                                res.status(240).send('Process begin! A email will be sent when the process is finish!')
                                            } else {
                                                res.status(500).send(err.message)
                                            }
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            } else {
                                res.status(241).send('Please try again later!')
                            }
                        })
                    }
                } else {
                    res.status(241).send('Email doenst exits')
                }
            } else {
                res.status(500).send(err.message)
            }
        });
    }
}