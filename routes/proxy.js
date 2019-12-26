const express = require('express');
const router = express.Router();

/* GET proxy page. */
router.get('/', function(req, res, next) {
    res.send('');
});

module.exports = router;
