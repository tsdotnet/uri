/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import {StringKeyValuePair} from '@tsdotnet/key-value-pair/dist/KeyValuePair';
import UriComponent from './UriComponent';

type QueryParamIterable
	= Iterable<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>;

type QueryParamArrayLike
	= ArrayLike<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>

declare namespace QueryParam
{
	export type ArrayLike = QueryParamArrayLike;

	export type Iterable = QueryParamIterable;

	export type IterableOrArrayLike = ArrayLike | Iterable;

	export type Convertible
		= string | UriComponent.Values | IterableOrArrayLike;
}

export default QueryParam;
