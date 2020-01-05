/* eslint-disable no-unused-vars */
const path = require('path');
const functions = require('./functions.js')
const Teams = require('./models/Teams')
const Players = require('./models/Players')
const Match = require('./models/Match')
const User = require('./models/Users.js')
const Link = require('./models/Links.js')
const Comment = require('./models/Comments.js')

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
    app.get('/player/:id', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'player.html'))
    })
    app.get('/team/:id', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'team.html'))
    })
    app.get('/match/:id', function (req, res) {
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
    })

    app.post('/admin/ask', function (req, res) {
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
                        let createLink = functions.createid(124)
                        let message = {
                            from: {
                                name: 'CSGOTeamStats NoReply',
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
    })

    app.get('/admin/program/:id', function (req, res) {
        let id = req.params.id;
        let type = req.query.type;
        console.log(id)
        console.log(type)
        if ((id && type) && (type === 'accept' || type === 'deny')) {
            Link.findOne({
                link: id
            }, function (err, link) {
                if (!err) {
                    if (link) {
                        let now = new Date().getTime()
                        if (link.state !== 'expired' && link.expire < now) {
                            if (type === 'accept') {
                                link.state = 'accept';
                                User.findById(link.user, function (err, user) {
                                    if (!err && user) {
                                        user.admin = true
                                        let userSave = user.save()
                                        let sessionSave = link.save()
                                        Promise.all([userSave, sessionSave]).then(() => {
                                            res.status(240).send('<h1>Admin Resquest Accepted</h1>')
                                        }).catch((err) => {
                                            res.status(500).send(err)
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            } else {
                                link.state = 'deny';
                                User.findById(link.user, function (err, user) {
                                    if (!err && user) {
                                        user.admin = 'ban'
                                        let userSave = user.save()
                                        let sessionSave = link.save()
                                        Promise.all([userSave, sessionSave]).then(() => {
                                            res.status(241).send('<h1>Admin Resquest Denied</h1>')
                                        }).catch((err) => {
                                            res.status(500).send(err)
                                        })
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            }
                        } else {
                            if (link.state === 'expired') {
                                res.status(209).send('<h1>Link Expire</h1>')
                            } else {
                                link.state = 'expired'
                                link.save(err => {
                                    if (!err) {
                                        res.status(209).send('<h1>Link Expire</h1>')
                                    } else {
                                        res.status(500).send(err.message)
                                    }
                                })
                            }
                        }
                    } else {
                        res.status(404).send('<h1>Request Link Failed</h1>')
                    }
                } else {
                    res.status(500).send(err.message)
                }
            })
        } else {
            res.status(417).send('<h1>Params missing</h1>')
        }
    })

    app.post('/fav/:type', function (req, res) {
        let id = req.body.id
        let userId = req.session.userid
        let type = req.params.type
        console.log(userId)
        User.findById(userId, function (err, user) {
            if (!err) {
                if (type === 'player') {
                    let boolean = user.favorite.players.includes(id)
                    if (boolean) {
                        user.favorite.players.splice(user.favorite.players.indexOf(id), 1)
                        res.status(200).send('remove')
                    } else {
                        user.favorite.players.push(id)
                        res.status(200).send('added')
                    }
                    user.save()
                } else if (type === 'team') {
                    let boolean = user.favorite.teams.includes(id)
                    if (boolean) {
                        user.favorite.teams.splice(user.favorite.teams.indexOf(id), 1)
                        res.status(200).send('remove')
                    } else {
                        user.favorite.teams.push(id)
                        res.status(200).send('added')
                    }
                    user.save()
                } else {
                    res.status(417).send('Type param failed')
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    })

    app.post('/player/:id', function (req, res) {
        let id = req.params.id;
        Players.findOne({
            id: id
        }, function (err, player) {
            if (!err) {
                if (player.team) {
                    Teams.findOne({
                        id: player.team.id
                    }, function (err, team) {
                        if (!err) {
                            Comment.find({
                                type: 'player',
                                id: id
                            }, function (err, comments) {
                                if (!err) {
                                    if (req.session.userid) {
                                        User.findById(req.session.userid, function (err, user) {
                                            if (!err) {
                                                functions.parseComments(comments, user._id).then(parsedComments => {
                                                    res.status(200).json({
                                                        player: player,
                                                        team: team,
                                                        fav: user.favorite.players.includes(id),
                                                        comments: parsedComments
                                                    })
                                                })
                                            } else {
                                                res.status(500).send('Error on server! Try again later!')
                                            }
                                        })
                                    } else {
                                        functions.parseComments(comments).then(parsedComments => {
                                            res.status(200).json({
                                                player: player,
                                                team: team,
                                                comments: parsedComments
                                            })
                                        })
                                    }
                                } else {
                                    res.status(500).send('Error on server! Try again later!')
                                }
                            })
                        } else {
                            res.status(500).send('Error on server! Try again later!')
                        }
                    })
                } else {
                    player.team = null
                    res.status(200).json(player)
                }
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    })
    app.post('/team/:id', function (req, res) {
        let id = req.params.id;
        Teams.findOne({
            id: id
        }, function (err, team) {
            console.log(team)
            if (!err) {
                res.status(200).json(team)
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    })

    app.post('/matches/:id', function (req, res) {
        let id = req.params.id;
        Match.findOne({
            id: id
        }, function (err, match) {
            if (!err) {
                res.status(200).json(match)
            } else {
                res.status(500).send('Error on server! Try again later!')
            }
        })
    })

    app.post('/comment/create', function (req, res) {
        let comment = req.body
        if (req.session.userid) {
            let newComment = new Comment();
            newComment.type = comment.type;
            newComment.text = comment.text;
            newComment.id = comment.id;
            newComment.isAnon = comment.isAnon;
            newComment.hasEdit = false;
            newComment.user = req.session.userid;
            newComment.date = new Date();
            newComment.save((err, comment) => {
                if (!err) {
                    User.findById(req.session.userid, function (err, user) {
                        if (!err) {
                            res.status(200).json({
                                id: comment._id,
                                text: comment.text,
                                hasEdit: false,
                                user: comment.isAnon ? 'anon' : user.firstName,
                                date: comment.date,
                                isFromUser: true
                            })
                        } else {
                            res.status(500).send(err.message)
                        }
                    })
                } else {
                    res.status(500).send(err.message)
                }
            })
        } else {
            res.status(200).send(false)
        }
    })

    app.post('/comment/delete', function (req, res) {
        if (req.session.userid) {

        } else {
            res.status(200).send(false)
        }
    })

    app.post('/comment/edit', function (req, res) {
        if (req.session.userid) {

        } else {
            res.status(200).send(false)
        }
    })

    app.post('/auth/validate', function (req, res) {
        if (req.session.userid) {
            User.findById(req.session.userid, (err, user) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    if (user && user.atribuitesessionid === req.session.sessionId) {
                        res.status(200).send(req.session.sessionId)
                    } else {
                        res.status(200).send(false)
                    }
                }
            })
        } else {
            res.status(200).send(false)
        }
    })

    app.post('/auth/logout', function (req, res) {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    res.status(200).send(true)
                }
            });
        }
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