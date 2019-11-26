const path = require('path');
// eslint-disable-next-line no-unused-vars
const functions = require('./functions.js')

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.status(501).send('Not Implemented')
    })

    app.get('/getresquestlogs', function (req, res) {
        let pin = req.query.pin;
        if (app.get('pin') === pin) {
            res.status(200).download(path.join(global.appRoot, 'db', 'logs', 'requests.json'), 'RequestsLogs.pdf');
        } else {
            res.status(403).send('Unauthorized')
        }
    })

    //Remove the next line if you want to server .ico files
    app.get('*.ico', function (req, res, next) {
        res.status(501).send('Not Implemented')
        next({
            status: 501,
            message: 'ICO FILES DISABLED'
        })
    })

    app.get('*', function (req, res) {
        res.status(404).sendFile(path.join(global.appRoot, 'views', '404.html'));
    })
}