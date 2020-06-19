import * as React from 'react';
import { CSSProperties, FC } from 'react';
import { ModsMap, WrapperProps, AnyFunction } from './types';
import { isFunction, isBoolean } from './utils';

export const createStyleMods = <
    TStyles extends any = CSSProperties,
    TMap extends ModsMap<TStyles> = ModsMap<TStyles>
>(
    map: TMap
) => map;

export const withStyleMods = <TMap extends ModsMap>(map: TMap) => {
    return <TComponent extends FC<{ style?: any }>>(Component: TComponent) => {
        const Wrapper: FC<WrapperProps<TComponent, TMap>> = (props) => {
            const [style, restProps] = selectStyles(props, map);
            return <Component {...restProps} style={style} />;
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
