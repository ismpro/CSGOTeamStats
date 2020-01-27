const {
    parseComments
} = require('../../functions.js');
const Comment = require('../../models/Comment.js/index.js');

module.exports = function () {
    return function (req, res) {
        if (req.session.userid) {
            Comment.findById(req.body.id, function (err, comment) {
                if (!err) {
                    comment.text = req.body.text;
                    comment.hasEdit = {
                        user: req.session.userid,
                        date: new Date()
                    };
                    comment.save((err, comment) => {
                        if (!err) {
                            parseComments([comment], req.session.userid).then(data => {
                                res.status(200).json(data[0])
                            }).catch(err => {
                                console.log(err)
                                res.status(500).send('Error on Server!')
                            })
                        } else {
                            console.log(err)
                            res.status(500).send('Error on Server!')
                        }
                    })
                } else {
                    console.log(err)
                    res.status(500).send('Error on Server!')
                }
            })
        } else {
            res.status(200).send(false)
        }
    }
}