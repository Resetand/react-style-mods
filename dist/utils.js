"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.isBoolean = void 0;
exports.isBoolean = function (value) { return value === true || value === false; };
exports.isFunction = function (value) {
    return value instanceof Function;
};
//# sourceMappingURL=utils.js.map