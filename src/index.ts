import React, { forwardRef } from "react";
import type hoistNonReactStatics from "hoist-non-react-statics";

//----------------------------------------------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------------------------------------------

export type StyleModsDefinition<TStyles extends Dictionary = React.CSSProperties> = {
    [mod: string]: TStyles | ((propValue: any) => TStyles);
};

type Dictionary<T = any> = Record<PropertyKey, T>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type InferStyleModsStyleObject<TMods extends StyleModsDefinition> = TMods extends StyleModsDefinition<infer TStyles>
    ? Partial<UnionToIntersection<TStyles>>
    : never;

type StyleModsComponent<
    TComponent extends React.ComponentType<any>,
    TMods extends StyleModsDefinition
> = hoistNonReactStatics.NonReactStatics<TComponent> &
    React.ForwardRefExoticComponent<InferModsProps<TMods> & React.ComponentProps<TComponent>> &
    React.RefAttributes<React.ComponentProps<TComponent>>;

export type InferModsProps<TMods extends StyleModsDefinition> = {
    [K in keyof TMods]+?: TMods[K] extends (propValue?: infer P) => any // factory with optional prop (default value)
        ? boolean | P
        : TMods[K] extends (propValue: infer P) => any // factory with required prop
        ? P
        : boolean; // static mod
};

// ----------------------------------------------------------------------------------------------------------------
// Internal utils
// ----------------------------------------------------------------------------------------------------------------

function resolveProp(prop: any, mod: any) {
    if (mod instanceof Function) {
        if (prop === true || prop === false) {
            return prop === true ? mod() : {};
        }
        return mod(prop);
    }
    return prop ? mod : {};
}

function isEmpty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false; // Object is not empty
        }
    }
    return true; // Object is empty
}

// ----------------------------------------------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------------------------------------------

/**
 * Allows to select styles based on props and mods.
 */
export function createModsStylesFromProps<TProps extends Record<string, unknown>, TMods extends StyleModsDefinition>(
    props: TProps,
    mods: TMods
) {
    const style = {} as InferStyleModsStyleObject<TMods>;
    const restProps = {} as Omit<TProps, keyof TMods>;

    for (const prop of Object.keys(props)) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            if (prop in mods) {
                Object.assign(style, resolveProp(props[prop], mods[prop]));
            } else {
                Object.assign(restProps, { [prop]: props[prop] });
            }
        }
    }
    return [style, restProps] as const;
}

/**
 * Type-safe way to define style mods for a component.
 *
 * If you using TypeScript >= 4.9, you can `satisfy` instead of `defineStyleMods`.
 * @example
 * const mods = {
 *    // define your mods here ...
 * } satisfy StyleModsDefinition
 */
export function defineStyleMods<T extends StyleModsDefinition>(mods: T) {
    return mods;
}

type WithStyleMods = {
    <TMods extends StyleModsDefinition, TComponent extends React.ComponentType<any>>(
        mods: TMods,
        Component: TComponent
    ): StyleModsComponent<TComponent, TMods>;

    <TMods extends StyleModsDefinition>(mods: TMods): <TComponent extends React.ComponentType<any>>(
        Component: TComponent
    ) => StyleModsComponent<TComponent, TMods>;
};

export const withStyleMods: WithStyleMods = function withStyleMods(mods: StyleModsDefinition, Component?: React.ComponentType<any>) {
    if (Component === undefined) {
        return (Component) => withStyleMods(mods, Component);
    }

    const StyleModsWrapper = forwardRef(function StyleModsWrapper(props: any, ref: React.Ref<any>) {
        const [style, restProps] = createModsStylesFromProps(props, mods);
        if (typeof props.style === "object" && props.style !== null) {
            Object.assign(style, props.style);
        }
        return React.createElement(Component, { ref, ...restProps, ...(isEmpty(style) ? {} : { style }) });
    });

    Object.assign(StyleModsWrapper, Component);

    StyleModsWrapper.displayName = `withStyleMods(${Component.displayName || Component.name || "Component"})`;

    return StyleModsWrapper as any;
};
