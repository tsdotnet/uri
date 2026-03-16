"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const key_value_pair_1 = tslib_1.__importDefault(require("@tsdotnet/key-value-pair"));
const ordered_registry_1 = tslib_1.__importDefault(require("@tsdotnet/ordered-registry"));
const type_1 = tslib_1.__importDefault(require("@tsdotnet/type"));
const query_js_1 = require("./query.js");
class QueryBuilder extends ordered_registry_1.default {
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
        else if (type_1.default.isIterable(query)) {
            for (const entry of query) {
                (0, key_value_pair_1.default)(entry, (key, value) => { this.import(key, value); });
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
        (0, query_js_1.parse)(values, (key, value) => { this.importSingle(key, value); }, deserialize, decodeValues);
        return this;
    }
    encode(prefixIfNotEmpty) {
        return (0, query_js_1.encode)(this, prefixIfNotEmpty);
    }
    toString() {
        return this.encode();
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map