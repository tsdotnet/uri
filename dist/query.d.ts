/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import { Primitive } from '@tsdotnet/common-interfaces';
import { StringKeyValuePair } from '@tsdotnet/key-value-pair/dist/KeyValuePair';
import QueryParam from './QueryParam';
import UriComponent from './UriComponent';
/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
export declare function encode(values: UriComponent.Values | QueryParam.IterableOrArrayLike, prefixIfNotEmpty?: boolean): string;
/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export declare function encodeValue(value: UriComponent.Value): string;
/**
 * A shortcut for identifying an UriComponent.Formattable object.
 * @param instance
 * @returns {boolean}
 */
export declare function isUriComponentFormattable(instance: unknown): instance is UriComponent.Formattable;
/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 */
export declare function parse(query: string, entryHandler: (key: string, value: Primitive) => void, deserialize?: boolean, decodeValues?: boolean): void;
/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param {string} query
 * @param {boolean} deserialize Default is true.
 * @param {boolean} decodeValues Default is true.
 * @return {{[p: string]: Primitive | Primitive[]}}
 */
export declare function parseToValues(query: string, deserialize?: boolean, decodeValues?: boolean): {
    [key: string]: Primitive | Primitive[];
};
/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {StringKeyValuePair<string, Primitive>[]}
 */
export declare function parseToArray(query: string, deserialize?: boolean, decodeValues?: boolean): StringKeyValuePair<Primitive>[];
export declare namespace Separator {
    const Query: string;
    const Entry: string;
    const KeyValue: string;
}
