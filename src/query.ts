/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */

import {Primitive} from '@tsdotnet/common-interfaces';
import extractKeyValue from '@tsdotnet/key-value-pair';
import {StringKeyValuePair} from '@tsdotnet/key-value-pair/dist/KeyValuePair';
import * as Serialize from '@tsdotnet/serialization';
import type from '@tsdotnet/type';
import QueryParam from './QueryParam';
import UriComponent from './UriComponent';

/*
 * This module is provided as a lighter weight utility for acquiring query params.
 * If more detailed operations are necessary, consider importing QueryBuilder.
 */

const
	EMPTY               = '',
	QUERY_SEPARATOR     = '?',
	ENTRY_SEPARATOR     = '&',
	KEY_VALUE_SEPARATOR = '=',
	TO_URI_COMPONENT    = 'toUriComponent';


/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
export function encode (
	values: UriComponent.Values | QueryParam.IterableOrArrayLike,
	prefixIfNotEmpty?: boolean): string
{
	if(!values) return EMPTY;
	if(typeof values!='object') throw new TypeError('Collection of key value pair expected.');

	const entries: string[] = [];

	const iterable = type.asIterable<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>(values);
	if(iterable)
	{
		for(const entry of iterable)
		{
			extractKeyValue(entry,
				(key, value) => appendKeyValue(entries, key, value));
		}
	}
	else
	{
		for(const key of Object.keys(values))
		{
			appendKeyValue(entries, key, (values as any)[key]);
		}
	}

	return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY)
		+ entries.join(ENTRY_SEPARATOR);
}

function appendKeyValueSingle (
	entries: string[],
	key: string,
	value: UriComponent.Value): void
{
	entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}

// According to spec, if there is an array of values with the same key, then each value is replicated with that key.
function appendKeyValue (
	entries: string[],
	key: string,
	value: UriComponent.Value | Iterable<UriComponent.Value> | ArrayLike<UriComponent.Value>): void
{
	const iterable = type.asIterable<UriComponent.Value>(value);
	if(iterable)
	{
		for(const v of iterable) appendKeyValueSingle(entries, key, v);
	}
	else
	{
		appendKeyValueSingle(entries, key, value as UriComponent.Value);
	}
}

/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export function encodeValue (value: UriComponent.Value): string
{
	if(isUriComponentFormattable(value))
	{
		const v: string = value.toUriComponent();
		if(v && v.indexOf(ENTRY_SEPARATOR)!=1)
			throw '.toUriComponent() did not encode the value.';
		return v;
	}
	else
	{
		return encodeURIComponent(Serialize.toString(value));
	}
}

/**
 * A shortcut for identifying an UriComponent.Formattable object.
 * @param instance
 * @returns {boolean}
 */
export function isUriComponentFormattable (instance: unknown): instance is UriComponent.Formattable
{
	return type.hasMemberOfType<UriComponent.Formattable>(instance, TO_URI_COMPONENT, 'function');
}

/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 */
export function parse (
	query: string,
	entryHandler: (key: string, value: Primitive) => void,
	deserialize: boolean  = true,
	decodeValues: boolean = true): void
{
	if(query && (query = query.replace(/^\s*\?+/, '')))
	{
		const entries = query.split(ENTRY_SEPARATOR);
		for(const entry of entries)
		{
			/*
			 * Since it is technically possible to have multiple '=' we need to identify the first one.
			 * And if there is no '=' then the entry is ignored.
			 */
			const si = entry.indexOf(KEY_VALUE_SEPARATOR);
			if(si!= -1)
			{
				const key = entry.substring(0, si);
				let value = entry.substring(si + 1) as any;
				if(decodeValues) value = decodeURIComponent(value);
				if(deserialize) value = Serialize.toPrimitive(value);
				entryHandler(key, value);
			}
		}
	}
}

/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param {string} query
 * @param {boolean} deserialize Default is true.
 * @param {boolean} decodeValues Default is true.
 * @return {{[p: string]: Primitive | Primitive[]}}
 */
export function parseToValues (
	query: string,
	deserialize: boolean  = true,
	decodeValues: boolean = true): { [key: string]: Primitive | Primitive[] }
{
	const result: { [key: string]: Primitive | Primitive[] } = {};
	parse(query,
		(key, value) => {
			if((key) in (result))
			{
				let prev: any = result[key];
				if(!((prev) instanceof (Array)))
					result[key] = prev = [prev];
				prev.push(value);
			}
			else
				result[key] = value;
		},
		deserialize,
		decodeValues);
	return result;
}

/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {StringKeyValuePair<string, Primitive>[]}
 */
export function parseToArray (
	query: string,
	deserialize: boolean  = true,
	decodeValues: boolean = true): StringKeyValuePair<Primitive>[]
{
	const result: StringKeyValuePair<Primitive>[] = [];
	parse(query,
		(key, value) => {result.push({key: key, value: value});},
		deserialize,
		decodeValues
	);
	return result;
}


export namespace Separator
{
	export const Query: string = QUERY_SEPARATOR;
	export const Entry: string = ENTRY_SEPARATOR;
	export const KeyValue: string = KEY_VALUE_SEPARATOR;
}
Object.freeze(Separator);

