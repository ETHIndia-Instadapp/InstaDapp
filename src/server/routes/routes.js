const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('*', (req, res) => {
    res.send('Wrong URL');
});

module.exports = router;
