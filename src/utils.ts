export const isBoolean = (value: any): value is boolean => value === true || value === false;
export const isFunction = (value: any): value is (...args: any[]) => any => {
    return value instanceof Function;
};
