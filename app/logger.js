/* eslint-disable no-unused-vars */
const functions = require('./functions')
const iplocate = require('node-iplocate')
const path = require('path')
const chalk = require('chalk')
/**
 * 
 * @param 
 */
module.exports = function (options) {
    return function (req, res, next) {
        let startTime = new Date().getTime()
        res.on('finish', () => {
            const fileLocation = path.resolve('./db/logs/requests.json');
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
                    results.ip === '::1' ||
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
    };
};