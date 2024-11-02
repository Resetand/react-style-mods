import React, { forwardRef } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

//----------------------------------------------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------------------------------------------

export type StyleModsDefinition<TStyles extends Dictionary = React.CSSProperties> = {
    [mod: string]: TStyles | ((propValue: any) => TStyles);
};

type Dictionary<T = any> = Record<PropertyKey, T>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type InferStyleModsStyleObjectFromComponent<TComponent extends React.ComponentType<any>> = TComponent extends {
    _?: infer TMods extends StyleModsDefinition;
}
    ? InferStyleModsStyleObject<TMods>
    : {};

type InferStyleModsStyleFromHocFactory<TFactory extends (Component: React.ComponentType<any>) => any> = TFactory extends (
    Component: React.ComponentType<any>
) => infer TStyleModsComponent
    ? TStyleModsComponent extends StyleModsComponent<infer _, infer TMods>
        ? InferStyleModsStyleObject<TMods>
        : never
    : never;

type InferModsPropsByMods<TMods extends StyleModsDefinition> = {
    [K in keyof TMods]+?: TMods[K] extends (propValue?: infer P) => any // factory with optional prop (default value)
        ? boolean | P
        : TMods[K] extends (propValue: infer P) => any // factory with required prop
        ? P
        : boolean; // static mod
};

export type InferModsProps<T extends StyleModsDefinition | ((Component: React.ComponentType<any>) => any) | StyleModsComponent<any, any>> =
    T extends { _?: infer TStyleModsDefinition extends StyleModsDefinition }
        ? InferModsPropsByMods<TStyleModsDefinition>
        : T extends StyleModsDefinition
        ? InferModsPropsByMods<T>
        : never;

type InferStyleModsStyleObject<TMods extends StyleModsDefinition> = TMods extends StyleModsDefinition<infer TStyles>
    ? Partial<UnionToIntersection<TStyles>>
    : never;

type StyleModsComponent<
    TComponent extends React.ComponentType<any>,
    TMods extends StyleModsDefinition
> = hoistNonReactStatics.NonReactStatics<TComponent> &
    React.ForwardRefExoticComponent<InferModsProps<TMods> & React.ComponentProps<TComponent>> &
    React.RefAttributes<React.ComponentProps<TComponent>> & { _?: TMods };

type WithStyleMods = {
    <TMods extends StyleModsDefinition, TComponent extends React.ComponentType<any>>(
        mods: TMods,
        Component: TComponent
    ): StyleModsComponent<TComponent, TMods>;

    <TMods extends StyleModsDefinition>(mods: TMods): {
        <TComponent extends React.ComponentType<any>>(Component: TComponent): StyleModsComponent<TComponent, TMods>;
        _?: TMods;
    };
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

/**
 * Aggregates styles from props based on the provided style mods.
 * Note that the `style` prop is treated as a special case and will be merged with the aggregated styles.
 */
function aggregateStyleByProps<TProps extends Record<string, unknown>, TMods extends StyleModsDefinition>(props: TProps, mods: TMods) {
    const style = {} as InferStyleModsStyleObject<TMods>;
    const restProps = {} as Omit<TProps, keyof TMods>;
    let isEmpty = true;

    for (const prop of Object.keys(props)) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            const propValue = props[prop];

            if (prop in mods) {
                Object.assign(style, resolveProp(propValue, mods[prop]));
                isEmpty = false;
            } else {
                restProps[prop] = propValue;
            }
        }
    }

    if (props.style && typeof props.style === "object") {
        Object.assign(style, props.style);
        isEmpty = false;
    }

    return [isEmpty ? undefined : style, restProps] as const;
}

// ----------------------------------------------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------------------------------------------

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

export const withStyleMods: WithStyleMods = function withStyleMods(mods: StyleModsDefinition, Component?: React.ComponentType<any>) {
    if (Component === undefined) {
        return (Component) => withStyleMods(mods, Component);
    }

    const StyleModsWrapper = forwardRef(function StyleModsWrapper(props: any, ref: React.Ref<any>) {
        const [style, restProps] = aggregateStyleByProps(props, mods);
        return React.createElement(Component, { ref, style, ...restProps });
    });

    hoistNonReactStatics(StyleModsWrapper, Component);

    StyleModsWrapper.displayName = `withStyleMods(${Component.displayName || Component.name || "Component"})`;

    return StyleModsWrapper as any;
};
