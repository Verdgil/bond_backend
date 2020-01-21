const db = require("./db");

function check_tokken(req, res, next) { // Проверка верен ли токен
    let token = req.query.token;
    if(token === undefined) {
        res.json(err.gen_err('0'));
    }
    db.token.find({token: token}).exec(function (err, finding_token) {
        if (err) {
            res.json(err.gen_err('500'));
        }
        if (finding_token.length >= 1) {
            next();
        } else {
            res.json(err.gen_err('0'));
        }
    });
}

module.exports.check_tokken = check_tokken;