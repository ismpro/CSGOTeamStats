// @ts-nocheck
const {
    parseComments
} = require('../../functions.js');
const Comment = require('../../models/Comment');

/**
 * Function that creates comments made by the user
 * The body is expected an the type of the comment, the id of the type, the text, and if isAnon 
 * @module Comment/Create
 * @returns {Function}
 */
module.exports = function () {
    return function (req, res) {
        let comment = req.body
        console.log(comment)
        if (req.session.userid) {
            let newComment = new Comment();
            newComment.type = comment.type;
            newComment.text = comment.text;
            newComment.id = comment.id;
            newComment.isAnon = comment.isAnon;
            newComment.hasEdit = false;
            newComment.user = req.session.userid;
            newComment.date = new Date();
            newComment.save((err, comment) => {
                if (!err) {
                    parseComments([comment], req.session.userid).then(data => {
                        res.status(200).json(data[0])
                    }).catch(err => {
                        console.log(err)
                        res.status(500).send('Error on Server!')
                    })
                } else {
                    res.status(500).send(err.message)
                }
            })
        } else {
            res.status(200).send(false)
        }
    }
}