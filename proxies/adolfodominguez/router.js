const router = require('express').Router();
const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');
const harmon = require('harmon');
var axios = require('axios')
const modifyResponse = require('../../utils/modifyResponseOnFly');
const modifyBodyRegex = require('../../utils/modifyBodyRegEx');
// require('dotenv').config(); // Not sure to use this right now
//https://www.adolfodominguez.com
const BRAND_URL = 'www.adolfodominguez.com';
const PROXY_SUBDOMAIN = 'adolfodominguez';
const PROXY_FOLDER = './proxies/adolfodominguez'
const STATIC_FOLDER = './proxies/adolfodominguez/static'

const DEVELOPMENT = process.env.DEVELOPMENT || 'true' // Forced to string because server error
const PORT = process.env.PORT || 3000
const PORT_STRING = DEVELOPMENT === 'true' ? `:${PORT}` : ''
const HOST = process.env.HOST || `dev-syniva.es`
const SUBDOMAIN_HOST = `${PROXY_SUBDOMAIN}.${HOST}`


// Download function:
const downloadFile = async (url, filePath) => {
    // Writer stream where we want to download the file:
    const writer = fs.createWriteStream(`${filePath}/${url.split('/').at(-1)}`);
    const streamResponse = await axios({
        method: 'get',
        url: url,
        headers: {
            // Headers are from postman
            'authority': BRAND_URL,
            'referer': `https://${BRAND_URL}`,
            'Cookie': 'geo=ES'
        },
        responseType: 'stream' // This is required to use .pipe()
    });

    // Write data
    await streamResponse.data.pipe(writer);

    writer.on('finish', () => console.log(`Finished download of ${url}`));
    writer.on('error', () => console.error(`[ERROR] Error while dowloading ${url}`));
}

const cacheFile = async (reqPath, folderToSave, brandUrl) => {
    // Extract info:
    const fileName = reqPath.split('/').at(-1);
    if (fs.existsSync(`${folderToSave}/${fileName}`)) {
        return { fileName: fileName, root: folderToSave }
    } else {
        // Downloading fonts:
        await downloadFile(`https://${brandUrl}${reqPath}`, folderToSave);
        return { fileName: fileName, root: folderToSave }
    }
}

// Proxy:
var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    autoRewrite: true,
    target: `https://${BRAND_URL}`,
    agent: https.globalAgent,
    headers: {
        host: SUBDOMAIN_HOST,
        accessControlAllowOrigin: '*',
    },
    prependPath: false,
    hostRewrite: undefined,
    protocolRewrite: 'https:',
    cookieDomainRewrite: {
        // Fill with all cookies-domains detected:
        "www.adolfodominguez.com": SUBDOMAIN_HOST,
    }
});

// Proxy response modifier:
proxy.on('proxyRes', function (proxyRes, req, res) {

    // Headers set:
    if (proxyRes.headers['set-cookie']) {
        proxyRes.headers['set-cookie'].forEach(function (elem, index) {
            proxyRes.headers['set-cookie'][index] = proxyRes.headers['set-cookie'][index].replace('; secure', '');
        })
    }
    delete proxyRes.headers['content-length'];
    delete proxyRes.headers['access-control-allow-origin'];
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    res.set("content-security-policy", "");
    res.setHeader('access-control-allow-origin', '*');

    // Modify response on the fly:
    modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {



        const proxyReqPath = proxyRes.req.path;

        // LAST CHOICE TO CHANGE THINGS WITH BRUTE FORCE (TRY HARMON FIRST):
        if (body) {

            let bodyString = body;

            // bodyString = bodyString.replaceAll('utag.js', 'controlledError.js');
            if (proxyRes.headers["content-type"] && proxyRes.headers["content-type"].includes('html')) {
                bodyString = bodyString.replaceAll(
                    'www.adolfodominguez.com/on/demandware.store/Sites-ad-es-Site/es_ES/Search-UpdateGrid',
                    `${SUBDOMAIN_HOST}${PORT_STRING}/on/demandware.store/Sites-ad-es-Site/es_ES/Search-UpdateGrid`
                );
                bodyString = bodyString.replaceAll(
                    'www.adolfodominguez.com/on/demandware.store/Sites-ad-es-Site/es_ES/Product-Variation',
                    `${SUBDOMAIN_HOST}${PORT_STRING}/on/demandware.store/Sites-ad-es-Site/es_ES/Product-Variation`
                )
            }


            // Cambiando contenido de un JSON en el vuelo:
            if (proxyRes.headers["content-type"] && proxyRes.headers["content-type"].includes('json')) {
                bodyString = bodyString.replaceAll('url": "/on/demandware.static/', `url": "https://${BRAND_URL}/on/demandware.static/`);
            }


            const regexForHomeUrls = /href="https:.*?adolfodominguez.com/gm
            const regexForHomeMatchesNew = [...bodyString.matchAll(regexForHomeUrls)];
            regexForHomeMatchesNew.map(old => bodyString = bodyString.replaceAll(old[0], old[0].replaceAll('www.adolfodominguez.com', `${SUBDOMAIN_HOST}${PORT_STRING}`)));

            // Inserting the script
            // TODO: Check that it's an html content to insert the script
            bodyString = bodyString.replaceAll('</body>', `<script type="text/javascript" defer>${fs.readFileSync(`${PROXY_FOLDER}/script.js`)}</script><style>${fs.readFileSync(`${PROXY_FOLDER}/overrides.css`)}</style></body>`)
            return bodyString;
        }
        return body;
    });
});

// Harmon:
router.use(harmon([], [
    {
        query: 'div[class*="personalizedExperienceesp"]',
        func: (node) => {
            if (node) {
                node.setAttribute('style', 'display:none');
            }
        }
    },
    {
        query: 'a[href*="adolfodominguez.com"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            node.setAttribute('href', currentHref.replaceAll("www.adolfodominguez.com", `${SUBDOMAIN_HOST}${PORT_STRING}`));
        }
    },
    {
        query: 'link[href$=".ttf"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            if (currentHref) {
                node.setAttribute('href', `https://${SUBDOMAIN_HOST}${PORT_STRING}${currentHref}`)
            }

        }
    }, {
        query: 'a[href^="https://www.adolfodominguez.com"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            if (currentHref) {
                node.setAttribute('href', currentHref.replaceAll("www.adolfodominguez.com", `${SUBDOMAIN_HOST}${PORT_STRING}`))
            }
        }
    }, {
        query: 'img[data-src^="/"]',
        func: (node) => {
            let currentSrc = node.getAttribute('data-src');
            if (currentSrc) {
                node.setAttribute('data-src', `//www.adolfodominguez.com${currentSrc}`)
            }
        }
    }
    , {
        query: 'img[src^="/"]',
        func: (node) => {
            let currentSrc = node.getAttribute('src');
            if (currentSrc) {
                node.setAttribute('src', `//www.adolfodominguez.com${currentSrc}`)
            }
        }
    }
]));

// Change request headers:
proxy.on('proxyReq', function (proxyReq, req, res, options) {
    if (req.headers["referer"])
        proxyReq.setHeader('Referer', req.headers["referer"].replace(SUBDOMAIN_HOST, BRAND_URL));
    proxyReq.setHeader('Host', BRAND_URL);
    proxyReq.setHeader('Origin', BRAND_URL);
    proxyReq.setHeader('Authority', BRAND_URL);
});

// Router for font css:
router.all('/assets/fonts/', (req, res) => {
    // Config extracted from postman request:
    var config = {
        method: 'get',
        url: `https://www.adolfodominguez.com${req.originalUrl}`,
        headers: {
            'authority': BRAND_URL,
            'accept': 'text/css,*/*;q=0.1',
            'referer': `https://${BRAND_URL}/es/`,
            'Cookie': 'geo=ES'
        }
    };

    axios(config)
        .then(function (response) {
            res.setHeader("Content-Type", "text/css");
            res.send(response.data)
        })
        .catch(function (error) {
            console.log('[ERROR] Router for css fonts axios call: ', error);
            res.send('Error');
        });
});


router.all('/*.ttf', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.woff', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.woff2', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.css', async (req, res) => {
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.ico', async (req, res) => {
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.png', async (req, res) => {
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/*.jpg', async (req, res, next) => {
    if (req.path.startsWith('/on/demandware.static/')) return next()
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all("/", (req, res) => {
    res.redirect("/es-es/")
})

// Redirect cart path to home to prevent from buying
router.all("*/cart", (req, res) => {
    res.redirect("/es-es/")
})

// Router general:
router.all('/*', (req, res) => {
    proxy.web(req, res);
})

// Export:
module.exports = router;
