/* eslint-disable */
import * as React from 'react';
import { ComponentProps, CSSProperties, FC } from 'react';
import { isFunction } from './utils';

type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;

type AnyFunction = (...args: any[]) => any;

type InferParam<Fn extends AnyFunction> = {
    [P in keyof Parameters<Fn>]: {} extends Pick<Parameters<Fn>, P>
        ? Parameters<Fn>[0] | true
        : Parameters<Fn>[0];
}[0];

export type InferModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends AnyFunction ? InferParam<M[P]> : true;
};

type WrapperProps<TC extends FC, M extends ModsMap<any>> = ComponentProps<TC> & InferModsProps<M>;

export const createStyleMods = <
    TStyles extends any = CSSProperties,
    TMap extends ModsMap<TStyles> = ModsMap<TStyles>
>(
    map: TMap
) => map;

export const withStyleMods = <TMap extends ModsMap<any>>(map: TMap) => {
    return <TComponent extends FC>(Component: TComponent) => {
        const Wrapper: FC<WrapperProps<TComponent, TMap>> = (props) => {
            const [style, restProps] = selectStyles(props, map);
            return <Component {...restProps} style={style} />;
        };

        return Wrapper;
    };
};

const selectStyles = (props: any, mods: ModsMap<any>) => {
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
                isFunction(handler)
                    ? (props as any)[prop] === true
                        ? handler()
                        : handler(props[prop])
                    : props[prop]
                    ? handler
                    : {}
            );
        } else if (prop === 'style') {
            styles = Object.assign(styles, props[prop]);
        } else {
            restProps = Object.assign(restProps, { [prop]: props[prop] });
        }
    }
    return [styles, restProps];
};
