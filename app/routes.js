/* eslint-disable no-unused-vars */
const path = require('path');
const User = require('./models/Users.js')

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
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'index.html'))
    })
    app.get('/login', redirectHome, function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'login.html'))
    })
    app.get('/player/:id', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'player.html'))
    })
    app.get('/team/:id', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'team.html'))
    })
    app.get('/match/:id', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'match.html'))
    })
    app.get('/admin', function (req, res) {
        if (req.query.acesspin == app.get('pin')) {
            res.status(200).sendFile(path.join(global.appRoot, 'pages', 'admin.html'))
        } else {
            res.status(401).send('<h1>Request Unauthorized</h1>')
        }
    })

    app.post('/admin/login', require('./routes/admin/login-post')());

    app.post('/admin/ask', require('./routes/admin/ask-post')(transporter));

    app.get('/admin/program/:id', require('./routes/admin/program-id-post')());

    app.post('/fav/:type', require('./routes/fav/type-post')());

    app.post('/fav', require('./routes/fav/post')());

    app.post('/player/:id', require('./routes/player-post')())

    app.post('/team/:id', require('./routes/team-post')())

    app.post('/match/:id', require('./routes/match-post')())

    app.post('/comment/create', require('./routes/comment/create')())

    app.post('/comment/delete', require('./routes/comment/delete')())

    app.post('/comment/edit', require('./routes/comment/edit')())

    app.post('/auth/validate', require('./routes/auth/validate')())

    app.post('/auth/logout', require('./routes/auth/logout')())

    app.post('/auth/login', require('./routes/auth/login')())

    app.post('/auth/register', require('./routes/auth/register')())

    app.get('/fetchAllInfo', require('./routes/fetchAllInfo')(app, api))

    app.get('/addMatch', require('./routes/addMatch')(app, api))

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
        res.status(404).sendFile(path.join(global.appRoot, 'pages', '404.html'));
    })
}