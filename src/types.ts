import { FC } from 'react';

export type ModsMap<TStyles> = Record<string, TStyles | ((propValue: any) => TStyles)>;

export type AnyFunction = (...args: any[]) => any;

export type InferParam<Fn extends AnyFunction> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof Parameters<Fn>]: {} extends Pick<Parameters<Fn>, P> ? Parameters<Fn>[0] | boolean : Parameters<Fn>[0];
}[0];

export type ModsProps<M extends ModsMap<any>> = {
    [P in keyof M]+?: M[P] extends AnyFunction ? InferParam<M[P]> : boolean;
};

export type BaseProps = { style?: any };
export type Wrapper<TProps, TMap extends ModsMap<any>> = FC<
    TProps & ModsProps<TMap> & (React.RefAttributes<any> | React.ClassAttributes<any>)
>;
