const router = require('express').Router();

router.all('/*', (req, res) => {
    res.send('Apple subdomain...')
})

module.exports = router;