/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
import type SchemeValue from './SchemeValue';
declare namespace Scheme {
    const File: SchemeValue.File;
    const FTP: SchemeValue.FTP;
    const GOPHER: SchemeValue.Gopher;
    const HTTP: SchemeValue.HTTP;
    const HTTPS: SchemeValue.HTTPS;
    const LDAP: SchemeValue.LDAP;
    const MAILTO: SchemeValue.MailTo;
    const PIPE: SchemeValue.Pipe;
    const TCP: SchemeValue.TCP;
    const NEWS: SchemeValue.NNTP;
    const NNTP: SchemeValue.NNTP;
    const TELNET: SchemeValue.Telnet;
    const UUID: SchemeValue.UUID;
    const All: readonly ("file" | "ftp" | "gopher" | "http" | "https" | "ldap" | "mailto" | "net.pipe" | "net.tcp" | "nntp" | "news" | "telnet" | "uuid")[];
    function isValid(scheme: string): scheme is SchemeValue.Any;
}
export default Scheme;
