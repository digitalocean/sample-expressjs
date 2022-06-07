const router = require('express').Router();

router.all('/*', (req, res) => {
    res.send('Example subdomain...')
})

module.exports = router;