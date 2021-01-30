import { CSSProperties } from "react";
import { ModsMap, ValueModFactory } from "./types";

export const valueModFactory: ValueModFactory<CSSProperties> = (key: string, defaultValue?: any) => {
    return (value: any) => ({ [key]: value ?? defaultValue });
};

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
