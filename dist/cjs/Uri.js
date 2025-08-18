"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fields = exports.Uri = void 0;
const tslib_1 = require("tslib");
const exceptions_1 = require("@tsdotnet/exceptions");
const query_1 = require("./query");
const text_utility_1 = require("@tsdotnet/text-utility");
const Scheme_1 = tslib_1.__importDefault(require("./Scheme"));
const VOID0 = void 0;
class Uri {
    constructor(scheme, userInfo, host, port, path, query, fragment) {
        this.scheme = getScheme(scheme) || null;
        this.userInfo = userInfo || null;
        this.host = host || null;
        this.port = getPort(port);
        this.authority = this.getAuthority() || null;
        this.path = path || null;
        if (query && typeof query !== 'string')
            query = (0, query_1.encode)(query);
        this.query = formatQuery(query) || null;
        Object.freeze(this.queryParams = this.query
            ? (0, query_1.parseToValues)(this.query) : {});
        this.pathAndQuery = this.getPathAndQuery() || null;
        this.fragment = formatFragment(fragment) || null;
        this.absoluteUri = this.getAbsoluteUri();
        this.baseUri = this.absoluteUri.replace(/[?#].*/, '');
        Object.freeze(this);
    }
    get pathSegments() {
        return this.path
            && this.path.match(/^[/]|[^/]*[/]|[^/]+$/g)
            || [];
    }
    static from(uri, defaults) {
        const u = typeof uri === 'string'
            ? Uri.parse(uri)
            : uri;
        return new Uri(u && u.scheme || defaults && defaults.scheme, u && u.userInfo || defaults && defaults.userInfo, u && u.host || defaults && defaults.host, u && typeof u.port === 'number' && !isNaN(u.port)
            ? u.port
            : defaults && defaults.port, u && u.path || defaults && defaults.path, u && u.query || defaults && defaults.query, u && u.fragment || defaults && defaults.fragment);
    }
    static parse(url, throwIfInvalid = true) {
        let result = null;
        const ex = tryParse(url, (out) => { result = out; });
        if (throwIfInvalid && ex)
            throw ex;
        return result;
    }
    static tryParse(url, out) {
        return !tryParse(url, out);
    }
    static copyOf(map) {
        return copyUri(map);
    }
    static toString(uri) {
        return uri instanceof Uri
            ? uri.absoluteUri
            : uriToString(uri);
    }
    static getAuthority(uri) {
        return getAuthority(uri);
    }
    equals(other) {
        return this === other || this.absoluteUri == Uri.toString(other);
    }
    copyTo(map) {
        return copyUri(this, map);
    }
    updateQuery(query) {
        const values = this.toValues();
        values.query = query;
        return Uri.from(values);
    }
    toValues() {
        return this.copyTo({});
    }
    toString() {
        return this.absoluteUri;
    }
    getAbsoluteUri() {
        return uriToString(this);
    }
    getAuthority() {
        return getAuthority(this);
    }
    getPathAndQuery() {
        return getPathAndQuery(this);
    }
}
exports.Uri = Uri;
var Fields;
(function (Fields) {
    Fields[Fields["scheme"] = 0] = "scheme";
    Fields[Fields["userInfo"] = 1] = "userInfo";
    Fields[Fields["host"] = 2] = "host";
    Fields[Fields["port"] = 3] = "port";
    Fields[Fields["path"] = 4] = "path";
    Fields[Fields["query"] = 5] = "query";
    Fields[Fields["fragment"] = 6] = "fragment";
})(Fields || (exports.Fields = Fields = {}));
Object.freeze(Fields);
function copyUri(from, to) {
    let i = 0, field;
    if (!to)
        to = {};
    while ((field = Fields[i++])) {
        const value = from[field];
        if (value)
            to[field] = value;
    }
    return to;
}
const SLASH = '/', SLASH2 = '//', QM = query_1.Separator.Query, HASH = '#', EMPTY = '', AT = '@';
function getScheme(scheme) {
    let s = scheme;
    if (typeof s === 'string') {
        if (!s)
            return null;
        s = (0, text_utility_1.trim)(s)
            .toLowerCase()
            .replace(/[^a-z0-9+.-]+$/g, EMPTY);
        if (!s)
            return null;
        if (Scheme_1.default.isValid(s))
            return s;
    }
    else {
        if (s == null)
            return s;
    }
    throw new exceptions_1.ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
}
function getPort(port) {
    if (port === 0)
        return port;
    if (!port)
        return null;
    let p;
    switch (typeof port) {
        case 'number':
            p = port;
            if (p >= 0 && isFinite(p))
                return p;
            break;
        case 'string':
            if ((p = parseInt(port)) && !isNaN(p))
                return getPort(p);
            break;
    }
    throw new exceptions_1.ArgumentException('port', 'invalid value');
}
function getAuthority(uri) {
    if (!uri.host) {
        if (uri.userInfo)
            throw new exceptions_1.ArgumentException('host', 'Cannot include user info when there is no host.');
        if (typeof uri.port === 'number' && !isNaN(uri.port))
            throw new exceptions_1.ArgumentException('host', 'Cannot include a port when there is no host.');
    }
    let result = uri.host || EMPTY;
    if (result) {
        if (uri.userInfo)
            result = uri.userInfo + AT + result;
        if (typeof uri.port === 'number' && !isNaN(uri.port))
            result += ':' + uri.port;
        result = SLASH2 + result;
    }
    return result;
}
function formatQuery(query) {
    return query && ((query.indexOf(QM) !== 0 ? QM : EMPTY) + query);
}
function formatFragment(fragment) {
    return fragment && ((fragment.indexOf(HASH) !== 0 ? HASH : EMPTY) + fragment);
}
function getPathAndQuery(uri) {
    const path = uri.path, query = uri.query;
    return EMPTY
        + (path || EMPTY)
        + (formatQuery(query) || EMPTY);
}
function uriToString(uri) {
    const scheme = getScheme(uri.scheme);
    const authority = getAuthority(uri), pathAndQuery = getPathAndQuery(uri), fragment = formatFragment(uri.fragment);
    const part1 = EMPTY
        + ((scheme && (scheme + ':')) || EMPTY)
        + (authority || EMPTY);
    let part2 = EMPTY
        + (pathAndQuery || EMPTY)
        + (fragment || EMPTY);
    if (part1 && part2 && scheme && !authority)
        throw new exceptions_1.ArgumentException('authority', 'Cannot format schemed Uri with missing authority.');
    if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0)
        part2 = SLASH + part2;
    return part1 + part2;
}
function tryParse(url, out) {
    if (!url)
        return new exceptions_1.ArgumentException('url', 'Nothing to parse.');
    let i;
    const result = {};
    i = url.indexOf(HASH);
    if (i != -1) {
        result.fragment = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    i = url.indexOf(QM);
    if (i != -1) {
        result.query = url.substring(i + 1) || VOID0;
        url = url.substring(0, i);
    }
    i = url.indexOf(SLASH2);
    if (i != -1) {
        let scheme = (0, text_utility_1.trim)(url.substring(0, i));
        const c = /:$/;
        if (!c.test(scheme))
            return new exceptions_1.ArgumentException('url', 'Scheme was improperly formatted');
        scheme = (0, text_utility_1.trim)(scheme.replace(c, EMPTY));
        try {
            result.scheme = getScheme(scheme) || VOID0;
        }
        catch (ex) {
            return ex;
        }
        url = url.substring(i + 2);
    }
    i = url.indexOf(SLASH);
    if (i != -1) {
        result.path = url.substring(i);
        url = url.substring(0, i);
    }
    i = url.indexOf(AT);
    if (i != -1) {
        result.userInfo = url.substring(0, i) || VOID0;
        url = url.substring(i + 1);
    }
    i = url.indexOf(':');
    if (i != -1) {
        const port = parseInt((0, text_utility_1.trim)(url.substring(i + 1)));
        if (isNaN(port))
            return new exceptions_1.ArgumentException('url', 'Port was invalid.');
        result.port = port;
        url = url.substring(0, i);
    }
    url = (0, text_utility_1.trim)(url);
    if (url)
        result.host = url;
    out(copyUri(result));
    return null;
}
exports.default = Uri;
//# sourceMappingURL=Uri.js.map