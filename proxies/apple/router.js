const router = require('express').Router();
const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');
const harmon = require('harmon');
var axios = require('axios')
const modifyResponse = require('../../utils/modifyResponseOnFly');
// require('dotenv').config(); // Not sure to use this right now

const BRAND_URL = 'www.apple.com';
const DEVELOPMENT = process.env.DEVELOPMENT || 'true' // Forced to string because server error
const PORT = process.env.PORT || 3000
const PORT_STRING = DEVELOPMENT === 'true' ? `:${PORT}` : ''
const PROXY_SUBDOMAIN = 'apple';
const HOST = process.env.HOST || `dev-syniva.es`
const SUBDOMAIN_HOST = `${PROXY_SUBDOMAIN}.${HOST}`
const PROXY_FOLDER = './proxies/apple'
const STATIC_FOLDER = './proxies/apple/static'


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
            'referer': `https://${BRAND_URL}/es/`,
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
        "apple.com": SUBDOMAIN_HOST,
        "www.apple.com": SUBDOMAIN_HOST,
        ".apple.com": SUBDOMAIN_HOST
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

        // Modify CSS on the fly:
        // [TIP] -> It's possible to modify JS too if required (same logic as CSS) for sites with hydration
        if (proxyRes.req.path.slice(proxyRes.req.path.length - 4) === '.css') {
            return body.replaceAll('url("/', 'url("https://www.apple.com/')
        }

        // LAST CHOICE TO CHANGE THINGS WITH BRUTE FORCE (TRY HARMON FIRST):
        if (body) {
            // Example of changing by brute force the srcset of pictures using regex:
            let bodyString = body;

            // Inserting the script 
            // TODO: Check that it's an html content to insert the script
            bodyString = bodyString.replaceAll('</body>', `<script type="text/javascript" defer>${fs.readFileSync(`${PROXY_FOLDER}/script.js`)}</script></body>`)
            
            const srcsetRegex = /srcset="\/.*?"/gm;
            const srcsetMatches = [...bodyString.matchAll(srcsetRegex)];
            srcsetMatches.map(old => bodyString = bodyString.replaceAll(old[0], old[0].replaceAll('srcset="/', 'srcset="https://www.apple.com/')
                .replaceAll(' /', ' https://www.apple.com/')
            ))
            return bodyString;
        }
        return body;
    });
});

// Harmon:
router.use(harmon([], [
    {
        query: '[src^="/"]',
        func: (node) => {
            let currentSrc = node.getAttribute('src');
            node.setAttribute('src', `https://${BRAND_URL}${currentSrc}`)
        }
    },
    {
        query: 'link[href^="/wss"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            node.setAttribute('href', `https://${SUBDOMAIN_HOST}${PORT_STRING}${currentHref}`)
        }
    },
    {
        query: 'link[href^="https://www.apple.com/wss"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            node.setAttribute('href', currentHref.replaceAll(BRAND_URL, `${SUBDOMAIN_HOST}${PORT_STRING}`))
        }
    },
    {
        query: 'link[href$=".css"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            if (currentHref[0] === '/') {
                node.setAttribute('href', `https://${SUBDOMAIN_HOST}${PORT_STRING}${currentHref}`)
            }
        }
    },
    {
        query: 'a[href*="www.apple.com"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            node.setAttribute('href', currentHref.replaceAll(BRAND_URL, `${SUBDOMAIN_HOST}${PORT_STRING}`));
        }
    },
    {
        query: 'link[href^="/"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            node.setAttribute('href', `https://${BRAND_URL}${currentHref}`)
        }
    },
    {
        query: '[href*="/goto/"]',
        func: (node) => {
            let currentHref = node.getAttribute('href');
            if (currentHref.includes('buy_mac/macbook_air_m2')) {
                currentHref = currentHref.replaceAll('macbook_air_m2', 'macbook-air/con-chip-m2');
            }
            if (currentHref.includes('shop/goto/store')) {
                currentHref = currentHref.replaceAll('/shop/goto/','/');
            }
            node.setAttribute('href', currentHref.replaceAll('/goto/', '/').replaceAll('_', '-'));
        }
    },
    {
        query: 'img[src^="/"]',
        func: (node) => {
            let currentSrc = node.getAttribute('src');
            node.setAttribute('src', `https://${BRAND_URL}${currentSrc}`);
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
router.all('/wss/fonts', (req, res) => {
    // Config extracted from postman request:
    var config = {
        method: 'get',
        url: `https://www.apple.com${req.originalUrl}`,
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

// Router for fonts:
router.all('/wss/fonts*', async (req, res) => {
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

// Routers for images:
router.all('/*.png', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});
router.all('/*.jpg', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});
router.all('/*.webp', async (req, res) => { // Change to custom font urls
    const data = await cacheFile(req.path, STATIC_FOLDER, BRAND_URL);
    res.sendFile(data.fileName, { root: data.root });
});

router.all('/', (req, res) => {
    res.redirect('/es');
})

// Router general:
router.all('/*', (req, res) => {
    proxy.web(req, res);
})

// Export:
module.exports = router;
