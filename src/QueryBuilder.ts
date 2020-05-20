/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
/**
 * @packageDocumentation
 * @module uri
 */

import QueryParam from './QueryParam';
import {encode, parse} from './QueryParams';
import UriComponent from './UriComponent';
import OrderedRegistry from '@tsdotnet/ordered-registry'

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


	static init (
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder
	{
		return new QueryBuilder(query, decodeValues);
	}

	importQuery (
		query: QueryParam.Convertible,
		decodeValues: boolean = true): QueryBuilder
	{

		if(typeof query==='string')
		{
			this.importFromString(query, decodeValues);
		}
		else if(isFiniteEnumerableOrArrayLike(query))
		{
			this.importEntries(query);
		}
		else
		{
			this.importMap(<UriComponent.Values>query);
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
		const _ = this;
		parse(values,
			(key, value) => {
				if(_.containsKey(key))
				{
					const prev = _.getValue(key);
					if((prev) instanceof (Array))
						prev.push(value);
					else
						_.setValue(key, [<UriComponent.Value>prev, value]);
				}
				else
					_.setValue(key, value);
			},
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

