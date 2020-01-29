// @ts-nocheck
const fs = require('fs');
const path = require('path')
const User = require('./models/User')

/**
 * Used by the logger module
 * @function logger
 * @param {Number} code The hppt code
 */
exports.logger = function (code) {
    return new Promise((resolve, reject) => {
        exports.jsonReader(path.resolve('./app/config/severConfig.json'), (err, object) => {

            if (!code) {
                reject(Error('Code Not Sent'))
            }

            if (!err) {
                let codes = object.codes

                let findedCode = codes.find((element) => {
                    return element.code === code
                })

                if (!findedCode) {
                    reject(Error('Code Not Found'))
                } else {
                    resolve(findedCode)
                }
            } else {
                reject(err)
            }
        })
    })
};

/**
 * Parser json from a file into a js object
 * @function jsonReader
 * @param {String} filePath Path of the json file
 * @param {Function} cb Path of the json file
 */
exports.jsonReader = function (filePath, cb) {
    if (filePath)
        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                return cb && cb(err)
            }
            try {
                const object = JSON.parse(fileData)
                return cb && cb(null, object)
            } catch (err) {
                console.log(err.message)
                return cb && cb(err)
            }
        })
};

/**
 * Parser json from a js object into a json file
 * @function jsonWriter
 * @param {String} filePath Path of the json file
 * @param {Object} object js object
 * @param {Function} cb Path of the json file
 */
exports.jsonWriter = function (filePath, object, cb) {
    if (filePath && object)
        fs.writeFile(filePath, JSON.stringify(object), (err) => {
            if (err) {
                return cb && cb(err)
            } else {
                return cb && cb(null)
            }
        })
};

/**
 * Creates an String with random chars
 * @function createid
 * @param {Number} length The length of the string
 * @returns {String}
 */
exports.createid = function (length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

/**
 * Formats a date to a string with the format yyyy-mm-dd
 * @function formatDate
 * @param {Date} date The date to be formated
 * @returns {String}
 */
exports.formatDate = function (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

/**
 * Used to make your wait for a determine amount of time
 * @function sleep
 * @param {Number} time Number in ms
 * @returns {Promise}
 */
exports.sleep = function (time) {
    return new Promise(resolve => setTimeout(resolve, time))
};

/**
 * Used for the Comments routes to parse comments into object readable by the browser
 * @function parseComments
 * @param {Array} [comments] Array of unparsed comments
 * @param {String} [id] id of the user log in now
 * @returns {Array}
 */
exports.parseComments = async function (comments, id) {
    if (comments.length === 0) {
        return []
    }
    let parseComments = []
    for (const comment of comments) {
        let hasEdit = comment.hasEdit
        if (comment.hasEdit) {
            let user = await User.findById(comment.hasEdit.user)
            hasEdit = {
                user: user.admin ? user.firstName + ' (admin)' : user.firstName,
                date: comment.hasEdit.date
            }
        }
        let name = ''
        if (comment.isAnon) {
            name = 'anon'
        } else {
            let user = await User.findById(comment.user)
            if (user) {
                name = {
                    name: user.firstName,
                    id: user._id
                }
            } else {
                name = "del"
            }

        }
        parseComments.push({
            id: comment._id,
            text: comment.text,
            hasEdit: hasEdit,
            user: name,
            date: comment.date,
            isFromUser: comment.user.equals(id)
        })
    }
    parseComments.sort(function (a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? -1 : a < b ? 1 : 0;
    });
    return parseComments
};