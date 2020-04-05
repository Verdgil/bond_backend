const express = require('express');
const router = express.Router();
const err = require('../utils/str_err_lang_const');
const db = require('../utils/db');
const check_tokken = require("../utils/check_tokken");

router.get('/', function (req, res, next) {
    check_tokken.check_tokken(req, res, next);
});

router.get('/', function (req, res, next) {
    let token = req.query.token;
    db.token.find({token: token}).exec(function (errors,  finding_token) {
        if (errors) {
            res.json(err.gen_err('500'));
        }
        let user_id = finding_token[0].user;
        res.locals.user_id = db.user.findById(user_id).exec(function (errors,  finding_user) {
            if (errors) res.json(err.gen_err('500'));
            res.locals.user_id = finding_user.id;
            res.locals.user_obj = finding_user;
            next();
        });
    });
});



/* GET publicayion page. */
router.get('/', function(req, res, next) {
    db.user.find({login: res.locals["user_id"]}).exec(function (errors,  finding_user) {
        if (errors) {
            res.json(err.gen_err('500'));
        }
        db.publication.find({id: req.params["id"]}).select({ _id: 1, url: 1, likes: 1, dis_likes: 1})
            .exec(function (errors,  finding_publication) {
                if (errors) {
                    res.json(err.gen_err('500'));
                }
                let tmp_comment = new db.comment({
                    user: res.locals.user_obj,
                    publication: finding_publication[0],
                    text: req.query.text,
                    date: new Date()
                });
                tmp_comment.save(function (errors) {
                    if(errors) res.json(err.gen_err('500'));
                    else {
                        let ret = {
                            'info': {},
                            'status': 'success',
                            'payload': {}
                        };
                        res.json(ret);
                    }
                });
            });
    });
});

module.exports = router;
