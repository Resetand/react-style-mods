import { AnyFunction } from './types';

export const isBoolean = (value: any): value is boolean => value === true || value === false;
export const isFunction = (value: any): value is AnyFunction => {
    return value instanceof Function;
};
