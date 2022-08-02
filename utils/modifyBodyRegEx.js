/**
 * Modify body
 * @param urlToReplace {String} The URL you want to replace
 * @param hostUrl {String} The URL of
 * @param body {String} Body given in the HTTP response
 * @param tag {String} The target HTML tag
 * @param attribute {String} The target attribute
 * @param proxyRes {String} The target attribute
 * @param contentType {String} The target attribute
 */
module.exports = function modifyBody (urlToReplace, hostUrl, body, tag, attribute, proxyRes, contentType) {
    if (proxyRes.headers["content-type"] && proxyRes.headers["content-type"].includes(contentType)) {
        const regexForHomeUrls = new RegExp(`<${tag}\.\*\? ${attribute}="https:\/\/${urlToReplace}\.\*\?>`, 'gm')
        const regexForHomeMatchesNew = [...body.matchAll(regexForHomeUrls)]
        regexForHomeMatchesNew.map(old => body = body.replaceAll(old[0], old[0].replaceAll(urlToReplace, hostUrl)))
    }
    return body
}