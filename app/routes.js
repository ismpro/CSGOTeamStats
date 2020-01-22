/* eslint-disable no-unused-vars */
const path = require('path');
const User = require('./models/Users.js')

//Redirect Function for when you are log in
const redirectHome = (req, res, next) => {
    if (req.session.userid) {
        User.findById(req.session.userid, (err, user) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                if (user && user.atribuitesessionid === req.session.sessionId) {
                    res.redirect('/')
                } else {
                    next()
                }
            }
        })
    } else {
        next()
    }
}

const redirectProfile = (req, res, next) => {
    if (req.params.id === '-') {
        if (req.session.userid) {
            User.findById(req.session.userid, (err, user) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    if (user && user.atribuitesessionid === req.session.sessionId) {
                        next()
                    } else {
                        res.redirect('/')
                    }
                }
            })
        } else {
            res.redirect('/')
        }
    } else {
        next()
    }
}

const checkAdminSession = (req, res, next) => {
    next()
    /* if (req.session.userid) {
        User.findById(req.session.userid, (err, user) => {
            if (err) {
                res.status(500).send(err.message)
            } else {
                if (user && user.atribuitesessionid === req.session.sessionId && typeof user.admin !== 'string' && user.admin) {
                    next()
                } else {
                    res.status(401).send('Unauthorized')
                }
            }
        })
    } else {
        res.status(401).send('Unauthorized')
    } */
}

module.exports = function (app, api, transporter) {
    app.get('/', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'index.html'))
    })

    app.get('/login', redirectHome, function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'login.html'))
    })

    app.get('/results', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'results.html'))
    })

    app.get('/contact', function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'contact.html'))
    })

    app.get('/profile/:id', redirectProfile, function (req, res) {
        res.status(200).sendFile(path.join(global.appRoot, 'pages', 'profile.html'))
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
        if (req.query.accesspin == app.get('pin')) {
            res.status(200).sendFile(path.join(global.appRoot, 'pages', 'admin.html'))
        } else {
            res.status(401).send('<h1>Request Unauthorized</h1>')
        }
    })

    app.post('/profile/:id/get', require('./routes/profile/get')())

    app.post('/profile/:id/set', require('./routes/profile/set')())

    app.get('/ranking/players', require('./routes/ranking/players')(api))

    app.post('/email', require('./routes/email')(transporter));

    app.post('/admin/login', require('./routes/admin/login-post')());

    app.post('/admin/ask', require('./routes/admin/ask-post')(transporter));

    app.get('/admin/program/:id', require('./routes/admin/program-id-post')());

    app.post('/admin/info/user/get', checkAdminSession, require('./routes/admin/info/user/get')());

    app.post('/admin/info/user/create', checkAdminSession, require('./routes/admin/info/user/create')());

    app.post('/admin/info/user/delete', checkAdminSession, require('./routes/admin/info/user/delete')());

    app.post('/admin/info/user/edit', checkAdminSession, require('./routes/admin/info/user/edit')());

    app.post('/admin/info/team/get', checkAdminSession, require('./routes/admin/info/team/get')());

    app.post('/admin/info/team/create', checkAdminSession, require('./routes/admin/info/team/create')());

    app.post('/admin/info/team/delete', checkAdminSession, require('./routes/admin/info/team/delete')());

    app.post('/admin/info/team/edit', checkAdminSession, require('./routes/admin/info/team/edit')());

    app.post('/admin/info/player/get', checkAdminSession, require('./routes/admin/info/player/get')());

    app.post('/admin/info/player/create', checkAdminSession, require('./routes/admin/info/player/create')());

    app.post('/admin/info/player/delete', checkAdminSession, require('./routes/admin/info/player/delete')());

    app.post('/admin/info/player/edit', checkAdminSession, require('./routes/admin/info/player/edit')());

    app.post('/admin/info/match/get', checkAdminSession, require('./routes/admin/info/match/get')());

    app.post('/admin/info/match/create', checkAdminSession, require('./routes/admin/info/match/create')());

    app.post('/admin/info/match/delete', checkAdminSession, require('./routes/admin/info/match/delete')());

    app.post('/admin/info/match/edit', checkAdminSession, require('./routes/admin/info/match/edit')());

    app.post('/fav/:type', require('./routes/fav/type-post')());

    app.post('/fav', require('./routes/fav/post')());

    app.post('/player/:id', require('./routes/player-post')(api))

    app.post('/team/:id', require('./routes/team-post')(api))

    app.post('/match/:id', require('./routes/match-post')(api))

    app.post('/comment/create', require('./routes/comment/create')())

    app.post('/comment/delete', require('./routes/comment/delete')())

    app.post('/comment/edit', require('./routes/comment/edit')())

    app.post('/auth/validate', require('./routes/auth/validate')())

    app.post('/auth/logout', require('./routes/auth/logout')())

    app.post('/auth/login', require('./routes/auth/login')())

    app.post('/auth/register', require('./routes/auth/register')())

    app.post('/search', require('./routes/search')())

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