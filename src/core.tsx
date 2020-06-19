import * as React from 'react';
import { CSSProperties, FC } from 'react';
import { ModsMap, WrapperProps } from './types';
import { isFunction } from './utils';

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

const selectStyles = (props: any, mods: ModsMap<any>) => {
    let styles: Record<string, any> = {};
    let restProps: any = {};
    for (const prop in props) {
        if (!props.hasOwnProperty(prop)) {
            continue;
        }
        if (prop in mods) {
            const handler = mods[prop];
            const addition = isFunction(handler)
                ? props[prop] === true
                    ? handler()
                    : handler(props[prop])
                : props[prop]
                ? handler
                : {};

            styles = Object.assign(styles, addition);
        } else if (prop === 'style') {
            styles = Object.assign(styles, props[prop]);
        } else {
            restProps = Object.assign(restProps, { [prop]: props[prop] });
        }
    }
    return [styles, restProps];
};
