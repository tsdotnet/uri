/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
/**
 * @packageDocumentation
 * @module uri
 */
import OrderedRegistry from '@tsdotnet/ordered-registry';
import QueryParam from './QueryParam';
import UriComponent from './UriComponent';
/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export default class QueryBuilder extends OrderedRegistry<string, UriComponent.Value | UriComponent.Value[]> {
    constructor(query: QueryParam.Convertible, decodeValues?: boolean);
    /**
     * Creates a new QueryBuilder using the provided query.
     * @param {QueryParam.Convertible} query
     * @param {boolean} decodeValues
     * @return {QueryBuilder}
     */
    static init(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    /**
     * Accepts any convertible query parameter and imports the values.
     * @param {QueryParam.Convertible} query
     * @param {boolean} decodeValues
     * @return {QueryBuilder}
     */
    importQuery(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    /**
     * Adds a key+value to the query.
     * @param {string} key
     * @param {UriComponent.Value} value
     * @return {this}
     */
    importSingle(key: string, value: UriComponent.Value): this;
    /**
     * Adds a key+value or set of values by key.
     * @param {string} key
     * @param {UriComponent.Value | UriComponent.Value[]} value
     * @return {this}
     */
    import(key: string, value: UriComponent.Value | UriComponent.Value[]): this;
    /**
     * Imports a set of key+values.
     * @param {UriComponent.Values} values
     * @return {this}
     */
    importValues(values: UriComponent.Values): this;
    /**
     * Property parses the components of an URI into their values or array of values.
     * @param values
     * @param deserialize
     * @param decodeValues
     * @returns {QueryBuilder}
     */
    importFromString(values: string, deserialize?: boolean, decodeValues?: boolean): QueryBuilder;
    /**
     * Returns the encoded URI string
     */
    encode(prefixIfNotEmpty?: boolean): string;
    toString(): string;
}
