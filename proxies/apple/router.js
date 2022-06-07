const router = require('express').Router();
const fs = require('fs');
const https = require('https');
const httpProxy = require('http-proxy');
const harmon = require('harmon');
const modifyResponse = require('../../utils/modifyResponseOnFly');
// require('dotenv').config(); // Not sure to use this

const BRAND_URL = 'www.apple.com';
const DEVELOPMENT = process.env.DEVELOPMENT || 'true' // Forced to string because server error
const PORT = process.env.PORT || 3000
const PORT_STRING = DEVELOPMENT === 'true' ? `:${PORT}` : ''
const PROXY_SUBDOMAIN = 'apple';
const HOST = process.env.HOST || `dev-syniva.es`
const SUBDOMAIN_HOST = `${PROXY_SUBDOMAIN}.${HOST}`

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
        if (proxyRes.req.path.slice(proxyRes.req.path.length - 4) === '.css') {
            return body.replaceAll('url("/', 'url("https://www.apple.com/')
        }

        // [TIP] -> It's possible to modify JS too if required (same logic as CSS) for sites with hydration

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
            node.setAttribute('href', currentHref.replaceAll('www.apple.com', `${SUBDOMAIN_HOST}${PORT_STRING}`))
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
            node.setAttribute('href', currentHref.replaceAll('www.apple.com', `${SUBDOMAIN_HOST}${PORT_STRING}`));
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
            console.log('href -> ', currentHref);
            if (currentHref.includes('buy_mac/macbook_air_m2')) {
                console.log('href con macbook air m2 -> ', currentHref);
                currentHref = currentHref.replaceAll('macbook_air_m2', 'macbook-air/con-chip-m2');
                console.log('href con macbook air m2 CHANGED -> ', currentHref);
            }
            node.setAttribute('href', currentHref.replaceAll('/goto/', '/').replaceAll('_', '-'));
        }
    },
    {
        query: 'img[src^="/"]',
        func: (node) => {
            let currentSrc = node.getAttribute('src');
            node.setAttribute('src', `https://www.apple.com${currentSrc}`);
        }
    },
    {
        query: '[srcset*=".png"]',
        func: (node) => {
            let currentSrcset = node.getAttribute('srcset');
            node.setAttribute('srcset', `https://www.apple.com${currentSrcset}`);
            node.setAttribute('srcset', currentSrcset.replaceAll(', ', ', https://www.apple.com'));
        }
    },
    {
        query: '[srcset*=".jpg"]',
        func: (node) => {
            let currentSrcset = node.getAttribute('srcset');
            node.setAttribute('srcset', `https://www.apple.com${currentSrcset}`);
            node.setAttribute('srcset', currentSrcset.replaceAll(', ', ', https://www.apple.com'));
        }
    },
    {
        query: '[srcset*=".webp"]',
        func: (node) => {
            let currentSrcset = node.getAttribute('srcset');
            node.setAttribute('srcset', `https://www.apple.com${currentSrcset}`);
            node.setAttribute('srcset', currentSrcset.replaceAll(', ', ', https://www.apple.com'));
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

// Router:
router.all('/*', (req, res) => {
    proxy.web(req, res);
})

// Export:
module.exports = router;
