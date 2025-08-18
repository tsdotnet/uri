"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Scheme;
(function (Scheme) {
    Scheme.File = 'file';
    Scheme.FTP = 'ftp';
    Scheme.GOPHER = 'gopher';
    Scheme.HTTP = 'http';
    Scheme.HTTPS = 'https';
    Scheme.LDAP = 'ldap';
    Scheme.MAILTO = 'mailto';
    Scheme.PIPE = 'net.pipe';
    Scheme.TCP = 'net.tcp';
    Scheme.NEWS = 'news';
    Scheme.NNTP = 'nntp';
    Scheme.TELNET = 'telnet';
    Scheme.UUID = 'uuid';
    Scheme.All = Object.freeze([
        Scheme.File, Scheme.FTP, Scheme.GOPHER, Scheme.HTTP, Scheme.HTTPS, Scheme.LDAP, Scheme.MAILTO, Scheme.PIPE, Scheme.TCP, Scheme.NEWS, Scheme.NNTP, Scheme.TELNET, Scheme.UUID
    ]);
    function isValid(scheme) {
        return Scheme.All.indexOf(scheme) != -1;
    }
    Scheme.isValid = isValid;
})(Scheme || (Scheme = {}));
Object.freeze(Scheme);
exports.default = Scheme;
//# sourceMappingURL=Scheme.js.map