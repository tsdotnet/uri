/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */

import SchemeValue from './SchemeValue';

// noinspection SpellCheckingInspection
/**
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 *
 * ```
 *    urn:example:mammal:monotreme:echidna
 *    ??? ????????????????????????????????
 *   scheme             path
 * ```
 */
export interface UrnValues
{

	/**
	 * The scheme name for this URI.
	 */
	scheme?: SchemeValue.Any | null; // string literal

	/**
	 * The absolute path of the URI.
	 */
	path?: string | null;

}

/**
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 * scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
 *
 * ```
 *                      hierarchical part
 *          ???????????????????????????????????????????
 *                      authority               path
 *          ???????????????????????????????????????????
 *    abc://username:password@example.com:123/path/data?key=value#fragid1
 *    ???   ????????????????? ??????????? ???           ????????? ???????
 *  scheme  user information     host     port            query   fragment
 * ```
 */
export default interface UriValues
	extends UrnValues
{
	/**
	 * The user name, password, or other user-specific information associated with the specified URI.
	 */
	userInfo?: string | null;

	/**
	 * The host component of this instance.
	 */
	host?: string | null;

	/**
	 * The port number of this URI.
	 */
	port?: number | null;

	/**
	 * Gets any query information included in the specified URI.
	 */
	query?: string | null;

	/**
	 * The escaped URI fragment.
	 */
	fragment?: string | null;
}
