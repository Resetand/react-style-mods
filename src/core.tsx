import * as React from 'react';
import { AnyFunction, ModsMap, ModsProps } from './types';
import { isBoolean, isFunction } from './utils';

export function styleModsFactory<StylesValue>() {
    return <TMap extends ModsMap<TStyleValue>, TStyleValue extends StylesValue>(map: TMap) => {
        return map;
    };
}

export const withStyleMods = <TMap extends ModsMap<any>>(map: TMap) => {
    return <TProps extends { style?: any }>(Component: React.ComponentType<TProps>) => {
        const Wrapper: React.FC<TProps & ModsProps<TMap>> = (props) => {
            const [style, restProps] = selectStyles(props, map);
            if (Object.keys(style)) {
                return <Component {...restProps} style={style} />;
            }
            return <Component {...restProps} />;
        };
        return Wrapper;
    };
};

const resolveProp = (prop: any, mod: AnyFunction | object) => {
    if (isFunction(mod)) {
        if (isBoolean(prop)) {
            return prop === true ? mod() : {};
        }
        return mod(prop);
    }
    return prop ? mod : {};
};

const selectStyles = (props: any, mods: ModsMap<any>) => {
    let style: Record<string, any> = {};
    let restProps: any = {};
    for (const prop in props) {
        if (props.hasOwnProperty(prop)) {
            if (prop in mods) {
                style = Object.assign(style, resolveProp(props[prop], mods[prop]));
            } else if (prop === 'style') {
                style = Object.assign(style, props[prop]);
            } else {
                restProps = Object.assign(restProps, { [prop]: props[prop] });
            }
        }
    }
    return [style, restProps];
};
