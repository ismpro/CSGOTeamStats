const path = require('path');
// eslint-disable-next-line no-unused-vars
const functions = require('./functions.js')
const Teams = require('./models/Teams')
const Players = require('./models/Players')
const Match = require('./models/Match')
const User = require('./models/Users.js')

module.exports = function (app, api) {

    app.get('/', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'index.html'))
    })
    app.get('/login', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'login.html'))
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
                            res.status(220).send('Email or password invalid')
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
        if (app.get('pin') === pin) {
            try {
                var startDate = new Date();
                await Teams.deleteMany({})
                await Players.deleteMany({})
                await Match.deleteMany({})

                let allInfo = await api.fetchAllInfo(1)
                let teamsRes = await Teams.collection.insertMany(allInfo.teams);
                let playersRes = await Players.collection.insertMany(allInfo.players);
                let matchRes = await Match.collection.insertMany(allInfo.matches);

                var endDate = new Date();
                var seconds = endDate.getTime() - startDate.getTime();
                console.log(
                    `DB Reseted
                Teams Inserted: ${teamsRes.insertedCount}
                Players Inserted: ${ playersRes.insertedCount}
                Match Inserted: ${matchRes.insertedCount}
                Runtime: ${seconds} ms`)

            } catch (error) {
                console.log(error.stack)
                res.status(500).send(error)
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

    app.get('*', function (req, res) {
        res.status(404).sendFile(path.join(global.appRoot, 'views', '404.html'));
    })
}