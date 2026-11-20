/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import type {Primitive} from '@tsdotnet/common-interfaces';
import type {Serializable} from '@tsdotnet/serialization';

declare namespace UriComponent
{
	export interface Formattable
	{
		toUriComponent (): string;
	}

	export type Value
		= Primitive | Serializable | Formattable;

	export type Values = { [key: string]: Value | Value[] };
}

export default UriComponent;


