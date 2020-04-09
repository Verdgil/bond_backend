const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const db = require('../utils/db');
/* GET likes page. */

router.post('/like', function (req, res, next) {
    const id = req.body._id;
    const update = {$inc: {likes: 1}};
    db.publication.findByIdAndUpdate(id, update, {new: true},function (err, pub) {
        if (err) {
            res.send(err)
        }
        else {
            result = {
                'info':
                    {
                        'count': pub.likes,
                    },
                'playload': {},
                'status': 'success',
            }
            res.json(result);
        }
    });
});
router.post('/dislike', function (req, res, next) {
    const id = req.body._id;
    const update = {$inc: {dis_likes: 1}};
    db.publication.findByIdAndUpdate(id, update, {new: true},function (err, pub) {
        if (err) {
            res.send(err)
        }
        else {
            result = {
                'info':
                    {
                        'count': pub.dis_likes,
                    },
                'playload': {},
                'status': 'success',
            }
            res.json(result);
        }
    });
});
router.post('/unlike', function (req, res, next) {
    const id = req.body._id;
    const update = {$inc: {likes: -1}};
    db.publication.findByIdAndUpdate(id, update, {new: true},function (err, pub) {
        if (err) {
            res.send(err)
        }
        else {
            result = {
                'info':
                    {
                        'count': pub.likes,
                    },
                'playload': {},
                'status': 'success',
            }
            res.json(result);
        }
    });
});
router.post('/undislike', function (req, res, next) {
    const id = req.body._id;
    const update = {$inc: {dis_likes: -1}};
    db.publication.findByIdAndUpdate(id, update, {new: true},function (err, pub) {
        if (err) {
            res.send(err)
        }
        else {
            result = {
                'info':
                    {
                        'count': pub.dis_likes,
                    },
                'playload': {},
                'status': 'success',
            }
            res.json(result);
        }
    });
});
module.exports = router;

