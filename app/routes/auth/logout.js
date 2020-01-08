module.exports = function () {
    return function (req, res) {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(500).send(err.message)
                } else {
                    res.status(200).send(true)
                }
            });
        }
    }
}