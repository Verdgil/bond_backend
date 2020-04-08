const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../utils/db');
const crypto = require('crypto');
const err = require('../utils/str_err_lang_const');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

router.post('/', function (req, res, next) {
    let login = req.body.login;
    let password = req.body.password;
    let lang = 'ru_RU.UTF-8';

    if(login !== undefined && password !== undefined) {
        db.user.find({login: login}).exec(function (errors, user) {
            if (errors) res.json(err.gen_err('500'));

            if(user.length === 0) {
                res.json(err.gen_err('1'));
            }
            else {
                if(crypto.createHash('sha512').update(password + db.salt).digest('hex') === user[0].password) {
                    const new_token = new db.token({
                        user: user[0],
                        token: crypto.createHash('sha512').update(login + req.headers['user-agent'] +
                            (new Date()).getTime()).digest('hex'),
                        end_time: new Date((new Date()).getTime() + 31536000000) //Токен на 30 дней (в милисекундах)
                    });
                    new_token.save(function (errors) {
                        if (errors) res.json(err.gen_err('500'));
                        else {
                            let ret = {
                                'info': {},
                                'status': 'success',
                                'payload': {"token": new_token.token}
                            };
                            res.json(ret);
                        }
                    });
                } else {
                    if (errors) res.json(err.gen_err('1'));
                }
            }
        });
    }
    else {
        res.json(err.gen_err('500'));
    }
});

module.exports = router;