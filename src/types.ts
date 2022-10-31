import { ComponentType, FC } from "react";

// -- Хелперы Для выведения типов --

type AnyFunction = (...args: any[]) => any;

export type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;

type InferParam<Fn extends AnyFunction> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof Parameters<Fn>]: {} extends Pick<Parameters<Fn>, P> ? Parameters<Fn>[0] | boolean : Parameters<Fn>[0];
}[0];

type ModsPropsWrapped<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends AnyFunction ? InferParam<M[P]> : boolean;
};

// ----------------------------

export type ApplyModsHOC = <TModsItems extends StyleMods<any>[]>(
    ...mods: TModsItems
) => <P extends { style?: any }>(Component: ComponentType<P>) => ModsExtendedComponent<P, TModsItems[number]["_mods"]>;

export type ModsProps<M extends StyleMods<ModsMap<any>> | ModsMap<any>> = M extends StyleMods<ModsMap<any>>
    ? ModsPropsWrapped<M["_mods"]>
    : ModsPropsWrapped<M>;

export type StyleMods<TMods extends ModsMap<any>> = {
    _mods: TMods;
};

export type ModsExtendedComponent<TProps, TMap extends ModsMap<any>> = FC<
    TProps & ModsProps<TMap> & (React.RefAttributes<any> | React.ClassAttributes<any>)
>;
