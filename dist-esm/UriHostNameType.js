/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
 */
var UriHostNameType;
(function (UriHostNameType) {
    /**
     * The host is set, but the type cannot be determined.
     */
    UriHostNameType[UriHostNameType["Basic"] = 0] = "Basic";
    /**
     * The host name is a domain name system (DNS) style host name.
     */
    UriHostNameType[UriHostNameType["DNS"] = 1] = "DNS";
    /**
     * The host name is an Internet Protocol (IP) version 4 host address.
     */
    UriHostNameType[UriHostNameType["IPv4"] = 2] = "IPv4";
    /**
     * The host name is an Internet Protocol (IP) version 6 host address.
     */
    UriHostNameType[UriHostNameType["IPv6"] = 3] = "IPv6";
    /**
     * The type of the host name is not supplied.
     */
    UriHostNameType[UriHostNameType["Unknown"] = 4] = "Unknown";
})(UriHostNameType || (UriHostNameType = {}));
Object.freeze(UriHostNameType);
export default UriHostNameType;
//# sourceMappingURL=UriHostNameType.js.map