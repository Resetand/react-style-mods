import * as React from 'react';
import { ComponentType, forwardRef } from 'react';
import { AnyFunction, BaseProps, ModsMap, Wrapper } from './types';
import { isBoolean, isFunction } from './utils';

export function styleModsFactory<StylesValue>() {
    return <TMap extends ModsMap<TStyleValue>, TStyleValue extends StylesValue>(map: TMap) => {
        return map;
    };
}

export const withStyleMods = <TMap extends ModsMap<any>>(map: TMap) => {
    return <P extends BaseProps>(Component: ComponentType<P>): Wrapper<P, TMap> => {
        return forwardRef<any, any>((props, ref) => {
            const [style, restProps] = selectStyles(props, map);
            return (
                <Component
                    ref={ref}
                    {...restProps}
                    {...(Boolean(Object.keys(style).length) ? { style } : {})}
                />
            );
        });
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
