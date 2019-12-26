const express = require('express');
const router = express.Router();
const err = require('../utils/str_err_lang_const');
const db = require('../utils/db');

router.get('/:user_id', function (req, res, next) { // Проверка заполнен ли токен
    let token = req.query.token;
    if(token !== undefined) {
        next();
    }
    else {
        res.json(err.gen_err('0'));
    }
});

router.get('/:user_id', function (req, res, next) { // Проверка верен ли токен
    let token = req.query.token;
    db.token.find({token: token}).exec(function (err, finding_token) {
        if(err){
            res.json(err.gen_err('500'));
        }
        if(finding_token.length >= 1) {
            next();
        }
        else {
            res.json(err.gen_err('0'));
        }
    });

});

router.get('/:user_id', function (req, res, next) { // Проверка пользователя
    db.user.find({login: req.params['user_id']}).exec(function (err, finding_user){
        if(err){
            res.json(err.gen_err('500'));
        }
        if(finding_user.length >= 1) {
            next();
        }
        else {
            res.json(err.gen_err('1'));
        }
    });
});



/* GET publicayion page. */
router.get('/:user_id', function(req, res, next) {
    db.user.find({login: req.params['user_id']}).exec(function (err, finding_user) {
        if (err) {
            res.json(err.gen_err('500'));
        }
        db.publication.find({user: finding_user[0]}).exec(function (err, finding_publication) {
            if (err) {
                res.json(err.gen_err('500'));
            }
            let ret = {
                'info': {
                    'count': finding_publication.length
                },
                'status': 'success',
                'payload': {
                    'url': {},
                    'likes' : {},
                    'dislikes': {}
                }
            };
            for(let i = 0; i < finding_publication.length; i++) {
                ret['payload']['url'][i] = finding_publication[i].url;
                ret['payload']['likes'][i] = finding_publication[i].likes;
                ret['payload']['dislikes'][i] = finding_publication[i].dis_likes;
            }
            res.json(ret);
        });
    });
});

module.exports = router;
