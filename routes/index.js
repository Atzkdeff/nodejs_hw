const express = require('express');
const router = express.Router();

/**
 * GET get home page
 */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

module.exports = router;
