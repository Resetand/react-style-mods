/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSSProperties } from 'react';
import { ComponentType, forwardRef } from 'react';
import * as React from 'react';
import { ModsMap, BaseProps, Wrapper } from './types';
import { isFunction, isBoolean } from './utils';

export const styleModsFactory = <StylesValue,>() => {
    return <TMap extends ModsMap<TStyleValue>, TStyleValue extends StylesValue>(map: TMap) => {
        return map;
    };
};

export const withStyleMods = <TMap extends ModsMap<any>>(map: TMap) => {
    return <P extends BaseProps>(Component: ComponentType<P>): Wrapper<P, TMap> => {
        return forwardRef<any, any>((props, ref) => {
            const [style, restProps] = selectStyles(props, map);
            return <Component ref={ref} {...restProps} {...(Object.keys(style).length > 0 ? { style } : {})} />;
        }) as any;
    };
};

const resolveProp = (prop: any, mod: any) => {
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
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
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

export const styleMods = styleModsFactory<CSSProperties>();

export type { ModsProps } from './types';
