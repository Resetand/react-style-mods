/* eslint-disable */
import * as React from 'react';
import { ComponentProps, CSSProperties, FC } from 'react';
import { isFunction } from './utils';

type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;

type InferModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends (...args: any[]) => any ? Parameters<M[P]>[0] : boolean;
};

type WrapperProps<TC extends FC, M extends ModsMap<any>> = ComponentProps<TC> & InferModsProps<M>;

export const createStyleMods = <TMap extends ModsMap<TStyles>, TStyles = CSSProperties>(
    map: TMap
) => {
    return map;
};

export const withStyleMods = <TMap extends ModsMap<any>>(map: TMap) => {
    return <TComponent extends FC>(Component: TComponent) => {
        const Wrapper: FC<WrapperProps<TComponent, TMap>> = (props) => {
            const [style, restProps] = selectStyles(props, map);
            return <Component {...restProps} style={style} />;
        };

        return Wrapper;
    };
};

const selectStyles = <TStyles, TProps extends object, TMap extends ModsMap<TStyles>>(
    props: TProps,
    mods: TMap
) => {
    let styles: Record<string, any> = {};
    let restProps: any = {};
    for (const prop in props) {
        if (!props.hasOwnProperty(prop)) {
            continue;
        }
        if (prop in mods) {
            const handler = mods[prop];
            styles = Object.assign(
                styles,
                isFunction(handler) ? handler(props[prop]) : props[prop] ? handler : {}
            );
        } else if (prop === 'style') {
            styles = Object.assign(styles, props[prop]);
        } else {
            restProps = Object.assign(restProps, { [prop]: props[prop] });
        }
    }
    return [styles, restProps];
};