const path = require('path');
// eslint-disable-next-line no-unused-vars
const functions = require('./functions.js')
const Teams = require('./models/Teams')
const Players = require('./models/Players')
const Games = require('./models/Games')

module.exports = function (app, api) {

    app.get('/', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'views', 'index.html'))
    })

    app.get('/fetchAllInfo', async function (req, res) {
        let pin = req.query.pin;
        if (app.get('pin') === pin) {
            try {
                await Teams.deleteMany({})
                await Players.deleteMany({})
                await Games.deleteMany({})

                let allTeams = await api.fetchAllTeams()
                let teamsRes = await Teams.collection.insertMany(allTeams);

                let allPlayers = await api.fetchAllPlayers()
                let playersRes = await Players.collection.insertMany(allPlayers);

                /* let allGames = await api.fetchAllTeams() */
                /* await Games.collection.insertMany(allGames, function (err) {
                    if(err)
                    res.status(500).send('Error On Inseting players data')
                });  */
                res.status(200).send(
                    `<h2>DB Reseted</h2>
                    <p>Teams Inserted: ${teamsRes.insertedCount}</p> 
                <p>Players Inserted: ${playersRes.insertedCount}</p>`)
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