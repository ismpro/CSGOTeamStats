const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const helmet = require('helmet')
const mongoose = require('mongoose')
const chalk = require('chalk')
const ApiControler = require('./app/config/ApiControler.js')
const logger = require('./app/logger.js')

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
app.use(logger())

//Shameless Plug
app.use((req, res, next) => {
    res.setHeader('X-Authors', 'Ismael Lourenço e Alexendre Oliveira')
    next()
})

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