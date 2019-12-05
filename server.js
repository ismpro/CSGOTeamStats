/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const functions = require('./app/functions.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const iplocate = require('node-iplocate')
const helmet = require('helmet')
const mongoose = require('mongoose')
const chalk = require('chalk')
const ApiControler = require('./app/config/ApiControler.js')

console.clear()
console.log(chalk.green('\n  Starting server'));

//Config
const app = express()
app.use(helmet())
dotenv.config()

//Some varibles
app.set("port", process.env.PORT || 3001);
app.set("pin", process.env.PIN || 1234);
global.appRoot = path.resolve(__dirname);
global.NODE_MODE = Boolean(process.env.NODE_DEV === 'true');
console.log(chalk.green(`  Node Mode: ${(global.NODE_MODE ? 'DEV' : 'PRD')}`));

//Hltv API
let api = new ApiControler();

//MongoDB
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(chalk.green('\n  MongoDB Connected'));
    const Teams = require('./app/models/Teams')
    const Players = require('./app/models/Players')
    const Match = require('./app/models/Match')
    async function test() {
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
        }
    }
    test()
});

//Disabling things for security
app.disable('x-powered-by');

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

//Serving statics files
app.use('/static', express.static('public'))

//Setting up cookies parser
app.use(cookieParser())

//Setting Sessions
app.use(session({
    name: 'sid',
    resave: true,
    saveUninitialized: false,
    secret: process.env.SECRET || 'secretstring',
    cookie: {
        maxAge: 3600000,
        sameSite: 'lax',
        secure: false
    }
}))

//Logger
app.use((req, res, next) => {
    let startTime = new Date().getTime()
    res.on('finish', () => {
        const fileLocation = path.join(global.appRoot, 'db', 'logs', 'requests.json')
        let ip = req.headers['x-forwarded-for'] || req.ip
        var promise1 = new Promise((resolve, reject) => {
            functions.logger(res.statusCode).then(resolve).catch(reject)
        });
        var promise2 = new Promise((resolve, reject) => {
            iplocate(ip).then(resolve).catch(reject)
        });
        Promise.all([promise1, promise2]).then((values) => {
            let results = values[1]
            let code = values[0]
            const isLocalhost = Boolean(
                results.ip === '[::1]' ||
                // 127.0.0.1/8 is considered localhost for IPv4.
                results.ip.match(
                    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                ) ||
                results.ip === '0000:0000:0000:0000:0000:0000:0000:0001'
            );
            let localion = isLocalhost ? 'localhost' : results.country + (results.city ? ' - ' + results.city : '')
            let endTime = new Date().getTime()
            console.log(`\nRequest ${req.method} -> ${req.path} : ${isLocalhost ? 'localhost' : `${results.ip} - ${localion}`} ${(req.session.name ? 'by ' + req.session.name : '')} Time: ${endTime - startTime} ms`)
            console.log(`Code: ${chalk.hex(code.color)(code.code)} -> ${code.message}`);
            if (!global.NODE_MODE) {
                functions.jsonReader(fileLocation, function (err, object) {
                    if (!err) {
                        object.requests.push({
                            id: object.requests.length + 1,
                            date: new Date().toISOString().replace('T', ' ').replace('Z', ''),
                            method: req.method,
                            path: req.path,
                            ip: results.ip,
                            localion: localion,
                            user: req.session.name ? req.session.name : 'Not specific',
                            code: code.code,
                            message: code.message
                        })
                        functions.jsonWriter(fileLocation, object)
                    } else {
                        console.log('Logger Error:')
                        console.log(err)
                    }
                })
            }
        }).catch((err) => {
            console.log('Logger Error:')
            console.log(err)
        });
    })
    next()
});

//Adding Routes
require('./app/routes.js')(app, api)

//Handling erros inside of server
app.use(function (err, req, res) {
    res.status(500).send('Something broke!')
})

//Starting to listen to requests
var server = app.listen(app.get('port'),
    () => {
        console.log(chalk.green(`\n  Server Listing on: ${server.address().address === '::' ? 'localhost' : server.address().address}:${server.address().port}`))
    })