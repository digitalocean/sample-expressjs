const express = require('express')
const app = express()
const subdomain = require('express-subdomain');
const PORT = process.env.PORT || 3000
const DEVELOPMENT = process.env.DEVELOPMENT || 'true' // Forced to string because server error
const HOST = process.env.HOST || `dev-syniva.es:${PORT}`

require('events').EventEmitter.prototype._maxListeners = 100; // Increase maxListeners

// Subdomain Proxies Routers:

	// Example:
const exampleRouter = require('./proxies/example/router');
app.use(subdomain('example', exampleRouter));

	// Reals:
const appleRouter = require('./proxies/apple/router');
app.use(subdomain('apple.dev', appleRouter));
const appleRouter = require('./proxies/apple/router');
app.use(subdomain('apple', appleRouter));

const adolfodominguezRouter = require('./proxies/adolfodominguez/router');
app.use(subdomain('adolfodominguez', adolfodominguezRouter));

// Main Router:

if (DEVELOPMENT === 'true') {
	// On development mode is required to use the personal ssl certificates
	// and also  the "https" library instead of app.listen() :
	const https = require('https')
	const fs = require('fs')

	const privateKey = fs.readFileSync('./ssl/_wildcard.dev-syniva.es-key.pem');
	const certificate = fs.readFileSync('./ssl/_wildcard.dev-syniva.es.pem');
	const credentials = {
		key: privateKey,
		cert: certificate,
	};

	https.createServer(credentials, app).listen(PORT);
	console.log(`App listening on port ${PORT} ${DEVELOPMENT === 'true' ? 'on development mode' : 'on server mode'}! If everything is OK https://example.${HOST} should work on your web browser.`)
} else {
	// Normal behavior on server mode:
	app.listen(PORT, () => console.log(`App listening on port ${PORT} ${DEVELOPMENT === 'true' ? 'on development mode' : 'on server mode'}!`))
}

app.get('/', (req, res) => res.send(`Main web on ${DEVELOPMENT === 'true' ? 'development' : 'server'} mode...`))
