const express = require('express');
const router = express.Router();
const err = require('../utils/str_err_lang_const');
const db = require('../utils/db');
const check_tokken = require('../utils/check_tokken');
const bodyParser = require('body-parser');
const multer = require('multer');
const crypto = require('crypto');
const { exec } = require("child_process");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './input/')
    },
    filename: function (req, file, cb) {
        let origfn = file.originalname.split('.');
        let fn = crypto.createHash('sha256').update(origfn[0]).digest('hex');
        cb(null, fn + '-' + Date.now() + '.' +  origfn[origfn.length - 1])
    }
});
const upload = multer({ storage: storage });
// const request = require('request');
const fs = require('fs');


router.post('/', upload.any(), function (req, res, next) {
    check_tokken.check_tokken(req, res, next);
});

function convert_to_svg(inp_file_name, out_file_name)
{
    let param = '--despeckle-level 20 --despeckle-tightness 8.0';
    let trace = 'autotrace '  + param + ' ' + inp_file_name + ' --output-file ' + out_file_name;
    exec(trace, (error, stdout, stderr) => {});
}


router.post('/', function (req, res, next) {
    if(req.files.length === 1) {
        let fn = req.files[0].path;
        let fn_splited = fn.split('.');
        let need_exit = '.tga';
        res.locals.need_exit = need_exit;
        if(fn_splited[1] !== need_exit) {
            let convert_to_png_string = 'magick ' + fn + ' ' + fn_splited[0] + need_exit;
            exec(convert_to_png_string, (error, stdout, stderr) => {
                if (error || stderr) {
                    res.json(err.gen_err('500'));
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }
    }
    else {
        res.json(err.gen_err('500'));
    }
});

router.post('/', function (req, res, next) {
    let fn = req.files[0].path;
    let fn_splited = fn.split('.');
    let out_fn = 'output/' + fn_splited[0].split('/')[1] + '.svg';
    db.token.find({token: res.locals.token}).exec(function (errors,  finding_token) {
        if (errors) {
            res.json(err.gen_err('500'));
        }
        let user_id = finding_token[0].user;
        res.locals.user_id = db.user.findById(user_id).exec(function (errors,  finding_user) {
            if (errors) res.json(err.gen_err('500'));
            res.locals.user_id = finding_user.id;
            res.locals.user_obj = finding_user;
            let publication = new db.publication({
                user: res.locals.user_obj,
                likes: 0,
                dis_likes: 0,
                date: new Date(),
                url: '/static/' + fn_splited[0].split('/')[1] + '.svg'
            });
            publication.save(function (errors) {
                if(errors) res.json(err.gen_err('500'));
                else {
                    let ret = {
                        "info": {
                            "waiting_time": 240
                        },
                        "payload": {
                            "url": '/static/' + fn_splited[0].split('/')[1] + '.svg',
                            "id": publication.id
                        },
                        "status":"success"
                    };
                    res.json(ret);
                }
            });

        });
    });
    convert_to_svg(fn_splited[0] + res.locals.need_exit, out_fn);

});

// Отдача страницы поиска
router.get('/', function (req, res, next) {
    res.send('<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '    <title>Регистрация</title>\n' +
        '    <meta charset="utf-8" />\n' +
        '</head>\n' +
        '<body>\n' +
        '    <h1>Введите данные</h1>\n' +
        '<h1>'+ Math.random() + '</h1>' +
        '    <form action="/send_rastr" method="post" enctype="multipart/form-data">\n' +
        '        <label>token</label><br>\n' +
        '        <input type="text" name="token" /><br><br>\n' +
        '        <label>file</label><br>\n' +
        '        <input type="file" name="audio" /><br><br>\n' +
        '        <input type="submit" value="Отправить" />\n' +
        '    </form>\n' +
        '</body>\n' +
        '<html>');
});


module.exports = router;