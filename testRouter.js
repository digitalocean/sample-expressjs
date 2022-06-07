const router = require('express').Router();

router.all('/*', (req, res) => {
    res.send('Test subdomain...')
})

module.exports = router;