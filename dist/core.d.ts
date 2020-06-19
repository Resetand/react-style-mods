import * as React from 'react';
import { ComponentProps, FC } from 'react';
declare type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;
declare type InferModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends (...args: any[]) => any ? Parameters<M[P]>[0] : boolean;
};
declare type WrapperProps<TC extends FC, M extends ModsMap<any>> = ComponentProps<TC> & InferModsProps<M>;
export declare const createStyleMods: <TMap extends Record<string, TStyles | ((propValue: any) => TStyles)>, TStyles = React.CSSProperties>(map: TMap) => TMap;
export declare const withStyleMods: <TMap extends Record<string, any>>(map: TMap) => <TComponent extends React.FC<{}>>(Component: TComponent) => React.FC<WrapperProps<TComponent, TMap>>;
export {};
