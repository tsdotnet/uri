"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Separator = void 0;
exports.encode = encode;
exports.encodeValue = encodeValue;
exports.isUriComponentFormattable = isUriComponentFormattable;
exports.parse = parse;
exports.parseToValues = parseToValues;
exports.parseToArray = parseToArray;
const tslib_1 = require("tslib");
const key_value_pair_1 = tslib_1.__importDefault(require("@tsdotnet/key-value-pair"));
const Serialize = tslib_1.__importStar(require("@tsdotnet/serialization"));
const type_1 = tslib_1.__importDefault(require("@tsdotnet/type"));
const EMPTY = '', QUERY_SEPARATOR = '?', ENTRY_SEPARATOR = '&', KEY_VALUE_SEPARATOR = '=', TO_URI_COMPONENT = 'toUriComponent';
function encode(values, prefixIfNotEmpty) {
    if (!values)
        return EMPTY;
    if (typeof values != 'object')
        throw new TypeError('Collection of key value pair expected.');
    const entries = [];
    const iterable = type_1.default.asIterable(values);
    if (iterable) {
        for (const entry of iterable) {
            (0, key_value_pair_1.default)(entry, (key, value) => appendKeyValue(entries, key, value));
        }
    }
    else {
        for (const key of Object.keys(values)) {
            appendKeyValue(entries, key, values[key]);
        }
    }
    return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY)
        + entries.join(ENTRY_SEPARATOR);
}
function appendKeyValueSingle(entries, key, value) {
    entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}
function appendKeyValue(entries, key, value) {
    const iterable = type_1.default.asIterable(value);
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
        return encodeURIComponent(Serialize.toString(value));
    }
}
function isUriComponentFormattable(instance) {
    return type_1.default.hasMemberOfType(instance, TO_URI_COMPONENT, 'function');
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
                    value = Serialize.toPrimitive(value);
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
})(Separator || (exports.Separator = Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=query.js.map