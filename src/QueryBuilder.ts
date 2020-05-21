/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
/**
 * @packageDocumentation
 * @module uri
 */

import extractKeyValue from '@tsdotnet/key-value-pair';
import {StringKeyValuePair} from '@tsdotnet/key-value-pair/dist/KeyValuePair';
import OrderedRegistry from '@tsdotnet/ordered-registry';
import type from '@tsdotnet/type';
import QueryParam from './QueryParam';
import {encode, parse} from './query';
import UriComponent from './UriComponent';

/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export default class QueryBuilder
	extends OrderedRegistry<string, UriComponent.Value | UriComponent.Value[]>
{

	constructor (
		query: QueryParam.Convertible,
		decodeValues: boolean = true)
	{
		super();

		this.importQuery(query, decodeValues);
	}


	/**
	 * Creates a new QueryBuilder using the provided query.
	 * @param {QueryParam.Convertible} query
	 * @param {boolean} decodeValues
	 * @return {QueryBuilder}
	 */
	static init (
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder
	{
		return new QueryBuilder(query, decodeValues);
	}

	/**
	 * Accepts any convertible query parameter and imports the values.
	 * @param {QueryParam.Convertible} query
	 * @param {boolean} decodeValues
	 * @return {QueryBuilder}
	 */
	importQuery (
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder
	{

		if(typeof query==='string')
		{
			this.importFromString(query, decodeValues);
		}
		else if(type.isIterable<StringKeyValuePair<UriComponent.Value | UriComponent.Value[]>>(query))
		{
			for(const entry of query)
			{
				extractKeyValue(entry,
					(key, value) => { this.import(key, value); });
			}
		}
		else
		{
			this.importValues(query as UriComponent.Values);
		}

		return this;
	}

	/**
	 * Adds a key+value to the query.
	 * @param {string} key
	 * @param {UriComponent.Value} value
	 * @return {this}
	 */
	importSingle (key: string, value: UriComponent.Value): this
	{
		if(this.has(key))
		{
			const prev = this.get(key);
			if(prev instanceof Array)
				prev.push(value);
			else
			{
				this.set(key, [prev as UriComponent.Value, value]);
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
	import (key: string, value: UriComponent.Value | UriComponent.Value[]): this
	{
		if(value instanceof Array)
		{
			for(const v of value) this.importSingle(key, v);
		}
		else
		{
			this.importSingle(key, value);
		}
		return this;
	}

	/**
	 * Imports a set of key+values.
	 * @param {UriComponent.Values} values
	 * @return {this}
	 */
	importValues (values: UriComponent.Values): this
	{
		for(const key of Object.keys(values))
		{
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
	importFromString (
		values: string,
		deserialize: boolean  = true,
		decodeValues: boolean = true): QueryBuilder
	{
		parse(values,
			(key, value) => { this.importSingle(key, value); },
			deserialize,
			decodeValues);

		return this;
	}


	/**
	 * Returns the encoded URI string
	 */
	encode (prefixIfNotEmpty?: boolean): string
	{
		return encode(this, prefixIfNotEmpty);
	}

	toString (): string
	{
		return this.encode();
	}
}

