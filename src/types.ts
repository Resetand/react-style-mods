import { CSSProperties, FC, ComponentProps } from 'react';

export type ModsMap<TStyles = CSSProperties> = Record<
    string,
    TStyles | ((propValue: any) => TStyles)
>;

export type AnyFunction = (...args: any[]) => any;

export type InferParam<Fn extends AnyFunction> = {
    [P in keyof Parameters<Fn>]: {} extends Pick<Parameters<Fn>, P>
        ? Parameters<Fn>[0] | true
        : Parameters<Fn>[0];
}[0];

export type ModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends AnyFunction ? InferParam<M[P]> : true;
};

export type WrapperProps<TC extends FC<any>, M extends ModsMap<any>> = ComponentProps<TC> &
    ModsProps<M>;
