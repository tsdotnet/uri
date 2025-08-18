/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import OrderedRegistry from '@tsdotnet/ordered-registry';
import type QueryParam from './QueryParam';
import type UriComponent from './UriComponent';
export default class QueryBuilder extends OrderedRegistry<string, UriComponent.Value | UriComponent.Value[]> {
    constructor(query: QueryParam.Convertible, decodeValues?: boolean);
    static init(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    importQuery(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    importSingle(key: string, value: UriComponent.Value): this;
    import(key: string, value: UriComponent.Value | UriComponent.Value[]): this;
    importValues(values: UriComponent.Values): this;
    importFromString(values: string, deserialize?: boolean, decodeValues?: boolean): QueryBuilder;
    encode(prefixIfNotEmpty?: boolean): string;
    toString(): string;
}
