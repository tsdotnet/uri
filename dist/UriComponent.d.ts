/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import {Primitive} from '@tsdotnet/common-interfaces';
import Serializable from '@tsdotnet/serialization/dist/Serializable';

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


