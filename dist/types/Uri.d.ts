/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */
import { Primitive } from '@tsdotnet/common-interfaces';
import type QueryParam from './QueryParam';
import type SchemeValue from './SchemeValue';
import type UriValues from './UriValues';
export declare class Uri implements UriValues {
    readonly scheme: SchemeValue.Any | null;
    readonly userInfo: string | null;
    readonly host: string | null;
    readonly port: number | null;
    readonly path: string | null;
    readonly query: string | null;
    readonly fragment: string | null;
    readonly queryParams: Readonly<{
        [key: string]: Primitive | Primitive[];
    }>;
    absoluteUri: string;
    readonly authority: string | null;
    readonly pathAndQuery: string | null;
    readonly baseUri: string;
    constructor(scheme: SchemeValue.Any | null, userInfo: string | null, host: string | null, port: number | null, path: string | null, query?: QueryParam.Convertible, fragment?: string);
    get pathSegments(): string[];
    static from(uri: string | UriValues | null | undefined, defaults?: UriValues): Uri;
    static parse(url: string): UriValues;
    static parse(url: string, throwIfInvalid: true): UriValues;
    static parse(url: string, throwIfInvalid: boolean): UriValues | null;
    static tryParse(url: string, out: (result: UriValues) => void): boolean;
    static copyOf(map: UriValues): UriValues;
    static toString(uri: UriValues): string;
    static getAuthority(uri: UriValues): string;
    equals(other: UriValues): boolean;
    copyTo(map: UriValues): UriValues;
    updateQuery(query: QueryParam.Convertible): Uri;
    toValues(): UriValues;
    toString(): string;
    protected getAbsoluteUri(): string;
    protected getAuthority(): string;
    protected getPathAndQuery(): string;
}
export declare enum Fields {
    scheme = 0,
    userInfo = 1,
    host = 2,
    port = 3,
    path = 4,
    query = 5,
    fragment = 6
}
export default Uri;
