/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import type { Primitive } from '@tsdotnet/common-interfaces';
import { StringKeyValuePair } from '@tsdotnet/key-value-pair';
import type QueryParam from './QueryParam';
import type UriComponent from './UriComponent';
export declare function encode(values: UriComponent.Values | QueryParam.IterableOrArrayLike, prefixIfNotEmpty?: boolean): string;
export declare function encodeValue(value: UriComponent.Value): string;
export declare function isUriComponentFormattable(instance: unknown): instance is UriComponent.Formattable;
export declare function parse(query: string, entryHandler: (key: string, value: Primitive) => void, deserialize?: boolean, decodeValues?: boolean): void;
export declare function parseToValues(query: string, deserialize?: boolean, decodeValues?: boolean): {
    [key: string]: Primitive | Primitive[];
};
export declare function parseToArray(query: string, deserialize?: boolean, decodeValues?: boolean): StringKeyValuePair<Primitive>[];
export declare namespace Separator {
    const Query: string;
    const Entry: string;
    const KeyValue: string;
}
