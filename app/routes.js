const path = require('path');
// eslint-disable-next-line no-unused-vars
const functions = require('./functions.js')
const Teams = require('./models/Teams')
const Players = require('./models/Players')
const Match = require('./models/Match')

module.exports = function (app, api) {

    app.get('/', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'index.html'))
    })

    app.post('/authentication/login', function (req, res) {
        let data = req.body;
        User.findOne({
            'email': data.email
        }, function (err, user) {
            if (!err && user) {
                let sessionId = functions.createid(64)
                req.session.userid = user._id
                req.session.sessionId = sessionId
                user.atribuitesessionid = sessionId
                user.save()
                req.session.save(() => {
                    res.status(200).send('/home')
                })
            } else {
                res.status(200).send(false)
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

                let allTeams = await api.fetchAllTeams()
                let teamsRes = await Teams.collection.insertMany(allTeams);

                let allPlayers = await api.fetchAllPlayers()
                let playersRes = await Players.collection.insertMany(allPlayers);

                let allMatch = await api.fetchAllMatches()
                let matchRes = await Match.collection.insertMany(allMatch);

                var endDate = new Date();
                var seconds = endDate.getTime() - startDate.getTime();
                res.status(200).send(
                    `<h2>DB Reseted</h2>
                <p>Teams Inserted: ${teamsRes.insertedCount}</p> 
                <p>Players Inserted: ${ playersRes.insertedCount}</p>
                <p>Match Inserted: ${matchRes.insertedCount}</p>
                <p>Runtime: ${seconds} ms`)
            } catch (error) {
                console.log(error)
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