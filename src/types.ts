import { FC, ComponentProps } from 'react';

export type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;

export type AnyFunction = (...args: any[]) => any;

export type InferParam<Fn extends AnyFunction> = {
    [P in keyof Parameters<Fn>]: {} extends Pick<Parameters<Fn>, P>
        ? Parameters<Fn>[0] | boolean
        : Parameters<Fn>[0];
}[0];

export type ModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends AnyFunction ? InferParam<M[P]> : boolean;
};

export type WrapperProps<
    TC extends React.ComponentType<any>,
    M extends ModsMap<any>
> = ComponentProps<TC> & ModsProps<M>;

export type InferStyleValue<TMap extends ModsMap<any>> = TMap extends ModsMap<infer T> ? T : never;
