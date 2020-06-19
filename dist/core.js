"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStyleMods = exports.createStyleMods = void 0;
var React = require("react");
var utils_1 = require("./utils");
exports.createStyleMods = function (map) {
    return map;
};
exports.withStyleMods = function (map) {
    return function (Component) {
        var Wrapper = function (props) {
            var _a = selectStyles(props, map), style = _a[0], restProps = _a[1];
            return React.createElement(Component, __assign({}, restProps, { style: style }));
        };
        return Wrapper;
    };
};
var selectStyles = function (props, mods) {
    var _a;
    var styles = {};
    var restProps = {};
    for (var prop in props) {
        if (!props.hasOwnProperty(prop)) {
            continue;
        }
        if (prop in mods) {
            var handler = mods[prop];
            styles = Object.assign(styles, utils_1.isFunction(handler) ? handler(props[prop]) : props[prop] ? handler : {});
        }
        else if (prop === 'style') {
            styles = Object.assign(styles, props[prop]);
        }
        else {
            restProps = Object.assign(restProps, (_a = {}, _a[prop] = props[prop], _a));
        }
    }
    return [styles, restProps];
};
//# sourceMappingURL=core.js.map