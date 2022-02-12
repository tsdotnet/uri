"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const key_value_pair_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/key-value-pair"));
const ordered_registry_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/ordered-registry"));
const type_1 = (0, tslib_1.__importDefault)(require("@tsdotnet/type"));
const query_1 = require("./query");
/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
class QueryBuilder extends ordered_registry_1.default {
    constructor(query, decodeValues = true) {
        super();
        this.importQuery(query, decodeValues);
    }
    /**
     * Creates a new QueryBuilder using the provided query.
     * @param {QueryParam.Convertible} query
     * @param {boolean} decodeValues
     * @return {QueryBuilder}
     */
    static init(query, decodeValues = true) {
        return new QueryBuilder(query, decodeValues);
    }
    /**
     * Accepts any convertible query parameter and imports the values.
     * @param {QueryParam.Convertible} query
     * @param {boolean} decodeValues
     * @return {QueryBuilder}
     */
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
    /**
     * Adds a key+value to the query.
     * @param {string} key
     * @param {UriComponent.Value} value
     * @return {this}
     */
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
    /**
     * Adds a key+value or set of values by key.
     * @param {string} key
     * @param {UriComponent.Value | UriComponent.Value[]} value
     * @return {this}
     */
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
    /**
     * Imports a set of key+values.
     * @param {UriComponent.Values} values
     * @return {this}
     */
    importValues(values) {
        for (const key of Object.keys(values)) {
            this.import(key, values[key]);
        }
        return this;
    }
    /**
     * Property parses the components of an URI into their values or array of values.
     * @param values
     * @param deserialize
     * @param decodeValues
     * @returns {QueryBuilder}
     */
    importFromString(values, deserialize = true, decodeValues = true) {
        (0, query_1.parse)(values, (key, value) => { this.importSingle(key, value); }, deserialize, decodeValues);
        return this;
    }
    /**
     * Returns the encoded URI string
     */
    encode(prefixIfNotEmpty) {
        return (0, query_1.encode)(this, prefixIfNotEmpty);
    }
    toString() {
        return this.encode();
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map