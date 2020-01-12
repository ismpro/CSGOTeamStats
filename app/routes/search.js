const Teams = require('../models/Teams.js');
const Players = require('../models/Players.js');

module.exports = function () {
    return function (req, res) {
        let data = req.body;
        console.log(data)
        let teamsPromise = Teams.find({
            name: {
                '$regex': `^${data.text}`,
                '$options': 'i'
            }
        })
        let playerPromise = Players.find({
            $or: [{
                name: {
                    '$regex': `^${data.text}`,
                    '$options': 'i'
                }
            }, {
                ign: {
                    '$regex': `^${data.text}`,
                    '$options': 'i'
                }
            }]
        })
        Promise.all([teamsPromise, playerPromise]).then(data => {
            res.status(200).send({
                teams: data[0],
                players: data[1]
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
    }
}

/*
@TODO
Alterar a query para que retorne so 100 limitado pode haver 1000 de players por exemplo e isso levaria um error de memoria
Exemplo:
In the latest mongoose (3.8.1 at the time of writing), you do two things differently: (1) you have to pass single argument to sort(),
which must be an array of constraints or just one constraint, and (2) execFind() is gone,
and replaced with exec() instead. Therefore, with the mongoose 3.8.1 you'd do this:

var q = Post.find({published: true}).sort({'date': -1}).limit(20);
q.exec(function(err, posts) {
     // `posts` will be of length 20
});

or you can chain it together simply like that:

Post
.find({published: true})
.sort({'date': -1})
.limit(20)
.exec(function(err, posts) {
     // `posts` will be of length 20
});

ou:

let users = await Users.find({}, null,{limit: 50});
*/