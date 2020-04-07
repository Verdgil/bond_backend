const db = require("./db");
const err = require('../utils/str_err_lang_const');

function check_tokken(req, res, next) { // Проверка верен ли токен
    let token = req.query.token;
    let token2 = req.body.token;
    if(token === undefined && token2 === undefined) {
        res.json(err.gen_err('0'));
    }
    else {
        if(token === undefined)
            token = token2;
        res.locals.token = token;
        db.token.find({token: token}).exec(function (errors, finding_token) {
            if (errors) {
                res.json(err.gen_err('500'));
            }
            if (finding_token.length >= 1) {
                next();
            } else {
                res.json(err.gen_err('0'));
            }
        });
    }
}

module.exports.check_tokken = check_tokken;