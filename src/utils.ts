import { CSSProperties } from "react";
import { ModsMap } from "./types";

function valueModFactory<T>() {
    function createValueModImpl<P extends keyof T>(key: P): (value: T[P]) => T;
    function createValueModImpl<P extends keyof T>(key: P, defaultValue: T[P]): (value?: T[P]) => T;
    function createValueModImpl(key: string, defaultValue?: any) {
        return (value: any) => ({ [key]: value ?? defaultValue });
    }
    return createValueModImpl;
}

export const cssValueMod = valueModFactory<CSSProperties>();

export const resolveProp = (prop: any, mod: any) => {
    if (mod instanceof Function) {
        if (prop === true || prop === false) {
            return prop === true ? mod() : {};
        }
        return mod(prop);
    }
    return prop ? mod : {};
};

export const selectStyles = (props: any, mods: ModsMap<any>) => {
    let style: Record<string, any> = {};
    let restProps: any = {};
    for (const prop in props) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            if (prop in mods) {
                style = Object.assign(style, resolveProp(props[prop], mods[prop]));
            } else if (prop === "style") {
                style = Object.assign(style, props[prop]);
            } else {
                restProps = Object.assign(restProps, { [prop]: props[prop] });
            }
        }
    }
    return [style, restProps];
};
