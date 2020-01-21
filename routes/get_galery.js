const express = require('express');
const router = express.Router();
const err = require('../utils/str_err_lang_const');
const db = require('../utils/db');
const check_tokken = require("../utils/check_tokken");

router.get('/:user_id', function (req, res, next) {
    check_tokken.check_tokken(req, res, next);
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
        db.publication.find({user: finding_user[0]}).select({ _id: 1, url: 1, likes: 1, dis_likes: 1})
          .exec(function (err, finding_publication) {
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
                    'dislikes': {},
                    'id': {}
                }
            };
            for(let i = 0; i < finding_publication.length; i++) {
                ret['payload']['url'][i] = finding_publication[i].url;
                ret['payload']['likes'][i] = finding_publication[i].likes;
                ret['payload']['dislikes'][i] = finding_publication[i].dis_likes;
                ret['payload']['id'][i] = finding_publication[i]._id.toString();
            }
            res.json(ret);
        });
    });
});

module.exports = router;
