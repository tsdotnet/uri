(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tsdotnet/key-value-pair'), require('@tsdotnet/serialization'), require('@tsdotnet/type'), require('@tsdotnet/ordered-registry'), require('@tsdotnet/exceptions'), require('@tsdotnet/text-utility')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tsdotnet/key-value-pair', '@tsdotnet/serialization', '@tsdotnet/type', '@tsdotnet/ordered-registry', '@tsdotnet/exceptions', '@tsdotnet/text-utility'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.tsdotnet = global.tsdotnet || {}, global.tsdotnet.uri = global.tsdotnet.uri || {}), global.tsdotnet.keyValuePair, global.tsdotnet.serialization, global.tsdotnet.type, global.tsdotnet.orderedRegistry, global.tsdotnet.exceptions, global.tsdotnet.textUtility));
})(this, (function (exports, extractKeyValue, Serialize, type, OrderedRegistry, exceptions, textUtility) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var Serialize__namespace = /*#__PURE__*/_interopNamespaceDefault(Serialize);

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    const EMPTY$1 = '', QUERY_SEPARATOR = '?', ENTRY_SEPARATOR = '&', KEY_VALUE_SEPARATOR = '=', TO_URI_COMPONENT = 'toUriComponent';
    function encode(values, prefixIfNotEmpty) {
        if (!values)
            return EMPTY$1;
        if (typeof values != 'object')
            throw new TypeError('Collection of key value pair expected.');
        const entries = [];
        const iterable = type.asIterable(values);
        if (iterable) {
            for (const entry of iterable) {
                extractKeyValue(entry, (key, value) => appendKeyValue(entries, key, value));
            }
        }
        else {
            for (const key of Object.keys(values)) {
                appendKeyValue(entries, key, values[key]);
            }
        }
        return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY$1)
            + entries.join(ENTRY_SEPARATOR);
    }
    function appendKeyValueSingle(entries, key, value) {
        entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
    }
    function appendKeyValue(entries, key, value) {
        const iterable = type.asIterable(value);
        if (iterable) {
            for (const v of iterable)
                appendKeyValueSingle(entries, key, v);
        }
        else {
            appendKeyValueSingle(entries, key, value);
        }
    }
    function encodeValue(value) {
        if (isUriComponentFormattable(value)) {
            const v = value.toUriComponent();
            if (v && v.indexOf(ENTRY_SEPARATOR) != 1)
                throw '.toUriComponent() did not encode the value.';
            return v;
        }
        else {
            return encodeURIComponent(Serialize__namespace.toString(value));
        }
    }
    function isUriComponentFormattable(instance) {
        return type.hasMemberOfType(instance, TO_URI_COMPONENT, 'function');
    }
    function parse(query, entryHandler, deserialize = true, decodeValues = true) {
        if (query && (query = query.replace(/^\s*\?+/, ''))) {
            const entries = query.split(ENTRY_SEPARATOR);
            for (const entry of entries) {
                const si = entry.indexOf(KEY_VALUE_SEPARATOR);
                if (si != -1) {
                    const key = entry.substring(0, si);
                    let value = entry.substring(si + 1);
                    if (decodeValues)
                        value = decodeURIComponent(value);
                    if (deserialize)
                        value = Serialize__namespace.toPrimitive(value);
                    entryHandler(key, value);
                }
            }
        }
    }
    function parseToValues(query, deserialize = true, decodeValues = true) {
        const result = {};
        parse(query, (key, value) => {
            if ((key) in (result)) {
                let prev = result[key];
                if (!((prev) instanceof (Array)))
                    result[key] = prev = [prev];
                prev.push(value);
            }
            else
                result[key] = value;
        }, deserialize, decodeValues);
        return result;
    }
    function parseToArray(query, deserialize = true, decodeValues = true) {
        const result = [];
        parse(query, (key, value) => { result.push({ key: key, value: value }); }, deserialize, decodeValues);
        return result;
    }
    var Separator;
    (function (Separator) {
        Separator.Query = QUERY_SEPARATOR;
        Separator.Entry = ENTRY_SEPARATOR;
        Separator.KeyValue = KEY_VALUE_SEPARATOR;
    })(Separator || (Separator = {}));
    Object.freeze(Separator);

    var query = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Separator () { return Separator; },
        encode: encode,
        encodeValue: encodeValue,
        isUriComponentFormattable: isUriComponentFormattable,
        parse: parse,
        parseToArray: parseToArray,
        parseToValues: parseToValues
    });

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    class QueryBuilder extends OrderedRegistry {
        constructor(query, decodeValues = true) {
            super();
            this.importQuery(query, decodeValues);
        }
        static init(query, decodeValues = true) {
            return new QueryBuilder(query, decodeValues);
        }
        importQuery(query, decodeValues = true) {
            if (typeof query === 'string') {
                this.importFromString(query, decodeValues);
            }
            else if (type.isIterable(query)) {
                for (const entry of query) {
                    extractKeyValue(entry, (key, value) => { this.import(key, value); });
                }
            }
            else {
                this.importValues(query);
            }
            return this;
        }
        importSingle(key, value) {
            if (this.has(key)) {
                const prev = this.get(key);
                if (prev instanceof Array)
                    prev.push(value);
                else {
                    this.set(key, [prev, value]);
                }
            }
            else
                this.set(key, value);
            return this;
        }
        import(key, value) {
            if (value instanceof Array) {
                for (const v of value)
                    this.importSingle(key, v);
            }
            else {
                this.importSingle(key, value);
            }
            return this;
        }
        importValues(values) {
            for (const key of Object.keys(values)) {
                this.import(key, values[key]);
            }
            return this;
        }
        importFromString(values, deserialize = true, decodeValues = true) {
            parse(values, (key, value) => { this.importSingle(key, value); }, deserialize, decodeValues);
            return this;
        }
        encode(prefixIfNotEmpty) {
            return encode(this, prefixIfNotEmpty);
        }
        toString() {
            return this.encode();
        }
    }

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
     */
    var Scheme;
    (function (Scheme) {
        Scheme.File = 'file';
        Scheme.FTP = 'ftp';
        Scheme.GOPHER = 'gopher';
        Scheme.HTTP = 'http';
        Scheme.HTTPS = 'https';
        Scheme.LDAP = 'ldap';
        Scheme.MAILTO = 'mailto';
        Scheme.PIPE = 'net.pipe';
        Scheme.TCP = 'net.tcp';
        Scheme.NEWS = 'news';
        Scheme.NNTP = 'nntp';
        Scheme.TELNET = 'telnet';
        Scheme.UUID = 'uuid';
        Scheme.All = Object.freeze([
            Scheme.File, Scheme.FTP, Scheme.GOPHER, Scheme.HTTP, Scheme.HTTPS, Scheme.LDAP, Scheme.MAILTO, Scheme.PIPE, Scheme.TCP, Scheme.NEWS, Scheme.NNTP, Scheme.TELNET, Scheme.UUID
        ]);
        function isValid(scheme) {
            return Scheme.All.indexOf(scheme) != -1;
        }
        Scheme.isValid = isValid;
    })(Scheme || (Scheme = {}));
    Object.freeze(Scheme);
    var Scheme$1 = Scheme;

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
     */
    const VOID0 = void 0;
    class Uri {
        scheme;
        userInfo;
        host;
        port;
        path;
        query;
        fragment;
        queryParams;
        absoluteUri;
        authority;
        pathAndQuery;
        baseUri;
        constructor(scheme, userInfo, host, port, path, query, fragment) {
            this.scheme = getScheme(scheme) || null;
            this.userInfo = userInfo || null;
            this.host = host || null;
            this.port = getPort(port);
            this.authority = this.getAuthority() || null;
            this.path = path || null;
            if (query && typeof query !== 'string')
                query = encode(query);
            this.query = formatQuery(query) || null;
            Object.freeze(this.queryParams = this.query
                ? parseToValues(this.query) : {});
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
    var Fields;
    (function (Fields) {
        Fields[Fields["scheme"] = 0] = "scheme";
        Fields[Fields["userInfo"] = 1] = "userInfo";
        Fields[Fields["host"] = 2] = "host";
        Fields[Fields["port"] = 3] = "port";
        Fields[Fields["path"] = 4] = "path";
        Fields[Fields["query"] = 5] = "query";
        Fields[Fields["fragment"] = 6] = "fragment";
    })(Fields || (Fields = {}));
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
    const SLASH = '/', SLASH2 = '//', QM = Separator.Query, HASH = '#', EMPTY = '', AT = '@';
    function getScheme(scheme) {
        let s = scheme;
        if (typeof s === 'string') {
            if (!s)
                return null;
            s = textUtility.trim(s)
                .toLowerCase()
                .replace(/[^a-z0-9+.-]+$/g, EMPTY);
            if (!s)
                return null;
            if (Scheme$1.isValid(s))
                return s;
        }
        else {
            if (s == null)
                return s;
        }
        throw new exceptions.ArgumentOutOfRangeException('scheme', scheme, 'Invalid scheme.');
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
        throw new exceptions.ArgumentException('port', 'invalid value');
    }
    function getAuthority(uri) {
        if (!uri.host) {
            if (uri.userInfo)
                throw new exceptions.ArgumentException('host', 'Cannot include user info when there is no host.');
            if (typeof uri.port === 'number' && !isNaN(uri.port))
                throw new exceptions.ArgumentException('host', 'Cannot include a port when there is no host.');
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
            throw new exceptions.ArgumentException('authority', 'Cannot format schemed Uri with missing authority.');
        if (part1 && pathAndQuery && pathAndQuery.indexOf(SLASH) !== 0)
            part2 = SLASH + part2;
        return part1 + part2;
    }
    function tryParse(url, out) {
        if (!url)
            return new exceptions.ArgumentException('url', 'Nothing to parse.');
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
            let scheme = textUtility.trim(url.substring(0, i));
            const c = /:$/;
            if (!c.test(scheme))
                return new exceptions.ArgumentException('url', 'Scheme was improperly formatted');
            scheme = textUtility.trim(scheme.replace(c, EMPTY));
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
            const port = parseInt(textUtility.trim(url.substring(i + 1)));
            if (isNaN(port))
                return new exceptions.ArgumentException('url', 'Port was invalid.');
            result.port = port;
            url = url.substring(0, i);
        }
        url = textUtility.trim(url);
        if (url)
            result.host = url;
        out(copyUri(result));
        return null;
    }

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
     */
    var UriHostNameType;
    (function (UriHostNameType) {
        UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
        UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
        UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
        UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
        UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
    })(UriHostNameType || (UriHostNameType = {}));
    Object.freeze(UriHostNameType);
    var UriHostNameType_default = UriHostNameType;

    exports.QueryBuilder = QueryBuilder;
    exports.Scheme = Scheme$1;
    exports.Uri = Uri;
    exports.UriHostNameType = UriHostNameType_default;
    exports.query = query;

}));
//# sourceMappingURL=uri.js.map
