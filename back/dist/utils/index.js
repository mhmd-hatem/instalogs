"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupAddress = void 0;
const ipaddr_js_1 = __importDefault(require("ipaddr.js"));
function cleanupAddress(str) {
    // if it's a valid ipv6 address, and if its a mapped ipv4 address,
    // then clean it up. otherwise return the original string.
    if (ipaddr_js_1.default.IPv6.isValid(str)) {
        var addr = ipaddr_js_1.default.IPv6.parse(str);
        if (addr.isIPv4MappedAddress()) {
            return addr.toIPv4Address().toString();
        }
    }
    return str;
}
exports.cleanupAddress = cleanupAddress;
