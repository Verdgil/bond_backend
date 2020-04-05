const express = require('express');
const router = express.Router();
const err = require('../utils/str_err_lang_const');
const db = require('../utils/db');
const check_tokken = require('../utils/check_tokken');

/* GET users listing. */
router.get('/:publication_id', function (req, res, next) {
    check_tokken.check_tokken(req, res, next);
});

router.get('/:publication_id', function (req, res, next) {
    db.publication.findById(req.params['publication_id']).exec(function (errors,  f_publication) {
        if (errors){
            res.json(err.gen_err('500'));
        }
        db.comment.find({publication: f_publication}).exec(function (errors,  comments) {
            if (errors){
                res.json(err.gen_err('500'));
            }
            let ret = {
                'info': {
                        'comment_num': 0,
                        'dislike': 0,
                        'like': 0,
                        'this_user_like':'like'
                    },
                'payload': {
                    'comments':[],
                    'url': ''
                },
                'status': 'success'
            };
            ret['info']['comment_num'] = comments.length;
            ret['info']['likes'] = f_publication.like;
            ret['info']['dislike'] = f_publication.dis_likes;
            ret['info']['this_user_like'] = "not_implemented";
            ret['payload']['url'] = f_publication.url;
            for(let i = 0; i < comments.length; i++) {
                ret['payload']['comments'][i] =
                    {
                        'login': 'Не доделано',
                        'text':''
                    };
                //
                /*db.user.findById(comments[i].user).exec(function (errors,  user) {
                    ret['payload']['comments'][i]['login'] = user.login;
                });*/
                ret['payload']['comments'][i]['text'] = comments[i].text;
                ret['payload']['comments'][i]['date'] = comments[i].date;
            }
            res.json(ret);
        });

    });
});

module.exports = router;