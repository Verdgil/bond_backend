const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../utils/db');
const crypto = require('crypto');
const err = require('../utils/str_err_lang_const');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies

// Функция логирования
router.use('/', function logs(req, res, next) {
    // console.log(req.body, req.headers);
    next();
});
// Выдача токенов
router.post('/', function (req, res, next) {
    let login = req.body.login;
    let password = req.body.password;
    let lang = (req.body.lang !== undefined && req.body.lang in err_str) ? (req.body.lang) : ('ru_RU.UTF-8');

    if(login !== undefined && password !== undefined) {
        db.user.find({login: login}).exec(function (errors, user) {
            if (errors) {
                res.json(err.gen_err('500'));
            }
            if(user.length === 0) {
                const new_user = new db.user({
                    login: login,
                    password: crypto.createHash('sha512').update(password + db.salt).digest('hex'),
                    lang: lang
                });
                new_user.save(function (errors) {
                    if(errors) {
                        res.json(err.gen_err('500'));
                    }

                    const new_token = new db.token({
                        user: new_user,
                        token: crypto.createHash('sha512').update(login + req.headers['user-agent'] +
                            (new Date()).getTime()).digest('hex'),
                        end_time: new Date((new Date()).getTime() + 2592000000) //Токен на 30 дней (в милисекундах)
                    });
                    new_token.save(function (err) {
                        if(err) {
                            res.json(err.gen_err('500'));
                        }
                        else {
                            let ret = {
                                'info': {},
                                'status': 'success',
                                'payload': {"token": new_token.token}
                            };
                            res.json(ret);
                        }
                    });
                });
            } else {
                res.json(err.gen_err('2'))
            }
        });
    }
    else {
        res.json(res.json(err.gen_err('0')));
    }
});

// Отдача страницы регистрации
router.get('/', function (req, res, next) {
    res.send('no');
});

module.exports = router;
