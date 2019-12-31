const path = require('path');
// eslint-disable-next-line no-unused-vars
const functions = require('./functions.js')
const Teams = require('./models/Teams')
const Players = require('./models/Players')
const Match = require('./models/Match')
const User = require('./models/Users.js')
const AdminConnection = require('./models/AdminConnection.js')

//Redirect Functions - Protection layer
const redirectHome = (req, res, next) => {
    if (req.session.userid) {
        User.findById(req.session.userid, (err, user) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                if (user && user.atribuitesessionid === req.session.sessionId) {
                    res.status(200).redirect('/')
                } else {
                    next()
                }
            }
        })
    } else {
        next()
    }
}

module.exports = function (app, api, transporter) {
    app.get('/', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'index.html'))
    })
    app.get('/login', redirectHome, function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'login.html'))
    })
    app.get('/player*', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'player.html'))
    })
    app.get('/team*', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'team.html'))
    })
    app.get('/match*', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'matches.html'))
    })
    app.get('/admin', function (req, res) {
        if (req.query.acesspin == app.get('pin')) {
            res.status(200).sendFile(path.join(global.appRoot, 'views', 'admin.html'))
        } else {
            res.status(401).send('<h1>Request Unauthorized</h1>')
        }
    })

    app.post('/admin/login', function (req, res) {
        let ip = req.headers['x-forwarded-for'] || req.ip
        let createdSessionId = functions.createid(64)
        let data = req.body;
        const isLocalhost = Boolean(
            ip === '::1' ||
            // 127.0.0.1/8 is considered localhost for IPv4.
            ip.match(
                /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
            ) ||
            ip === '0000:0000:0000:0000:0000:0000:0000:0001'
        );
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err) {
                if (user) {
                    if (user.validPassword(data.password) && user.admin) {
                        req.session.userid = user._id
                        req.session.sessionId = sessionId
                        user.atribuitesessionid = sessionId
                        let userSave = user.save()
                        let sessionSave = req.session.save()
                        Promise.all([userSave, sessionSave]).then(() => {
                            res.status(220).json({
                                name: user.firstName + ' ' + user.lastName,
                                ip: 
                            })
                        }).catch(() => {
                            res.status(500).send('Error on server! Try again later!')
                        })
                    } else {
                        res.status(221).send('Unauthorized')
                    }
                } else {
                    res.status(221).send('Unauthorized')
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        });
    })

    app.post('/player/:id', function (req, res) {
        res.status(200).send({
            id: req.params.id
        })
    })
    app.post('/auth/login', function (req, res) {
        let data = req.body;
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err) {
                if (user) {
                    if (user.validPassword(data.password)) {
                        let sessionId = functions.createid(64)
                        req.session.userid = user._id
                        req.session.sessionId = sessionId
                        user.atribuitesessionid = sessionId
                        let userSave = user.save()
                        let sessionSave = req.session.save()
                        Promise.all([userSave, sessionSave]).then(() => {
                            res.status(220).send('Not implemented')
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
    })

    app.post('/auth/register', function (req, res) {
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
    })

    app.get('/fetchAllInfo', async function (req, res) {
        let pin = req.query.pin;
        let pages = req.query.pages;
        if (app.get('pin') === pin) {
            res.status(200).send('Starting to reset')
            try {
                await Teams.deleteMany({})
                await Players.deleteMany({})
                await Match.deleteMany({})

                await api.fetchAllInfo(pages)

            } catch (error) {
                console.log(error.message)
            }
        } else {
            res.status(403).send('Unauthorized')
        }
    })

    app.get('/addMatch', async function (req, res) {
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
    })

    app.get('/getresquestlogs', function (req, res) {
        let pin = req.query.pin;
        if (app.get('pin') === pin) {
            res.status(200).download(path.join(global.appRoot, 'db', 'logs', 'requests.json'), 'RequestsLogs.pdf');
        } else {
            res.status(403).send('Unauthorized')
        }
    })

    app.get('/favicon.ico', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'public', 'images', 'favicon.ico'));
    })

    app.get('*', function (req, res) {
        res.status(404).sendFile(path.join(global.appRoot, 'views', '404.html'));
    })
}