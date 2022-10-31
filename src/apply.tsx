import React, { CSSProperties, forwardRef } from "react";
import { ApplyModsHOC, ModsMap, StyleMods } from "./types";
import { selectStyles } from "./utils";

export const createStyleMods = <TModsMap extends ModsMap<CSSProperties>>(mods: TModsMap): StyleMods<TModsMap> => ({
    _mods: mods,
});

/**
 * Hight Order Component wrapper to apply modifiers to a Component
 */
export const applyStyleMods: ApplyModsHOC = (...modsItems) => {
    const mods: ModsMap<any> = modsItems.reduce((acc, x) => ({ ...acc, ...x._mods }), {});

    return (Component) => {
        const WrappedComponent = forwardRef<any, any>((props, ref) => {
            const [style, restProps] = selectStyles(props, mods);
            return <Component ref={ref} {...restProps} {...(Object.keys(style).length > 0 ? { style } : {})} />;
        }) as any;

        WrappedComponent.displayName = Component.displayName;
        return WrappedComponent;
    };
};
