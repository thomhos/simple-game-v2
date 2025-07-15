export function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
    return fns.reduce((acc, fn) => fn(acc), value);
}

// Conditional function application
export const when = <T>(condition: boolean, fn: (arg: T) => T) => 
    (value: T): T => condition ? fn(value) : value;

export const unless = <T>(condition: boolean, fn: (arg: T) => T) => 
    (value: T): T => !condition ? fn(value) : value;

// Multiple conditional applications
export const whenAll = <T>(conditions: boolean[], fns: Array<(arg: T) => T>) => 
    (value: T): T => conditions.every(Boolean) ? pipe(value, ...fns) : value;

export const whenAny = <T>(conditions: boolean[], fns: Array<(arg: T) => T>) => 
    (value: T): T => conditions.some(Boolean) ? pipe(value, ...fns) : value;

// Repeat function application
export const repeat = <T>(times: number, fn: (arg: T) => T) => 
    (value: T): T => Array.from({ length: times }, () => fn).reduce((acc, f) => f(acc), value);

// Apply function multiple times based on condition
export const whilst = <T>(condition: (arg: T) => boolean, fn: (arg: T) => T) => 
    (value: T): T => {
        let result = value;
        while (condition(result)) {
            result = fn(result);
        }
        return result;
    };

// Tap - execute side effect without changing value (useful for debugging)
export const tap = <T>(fn: (arg: T) => void) => 
    (value: T): T => {
        fn(value);
        return value;
    };

// Try-catch wrapper that returns original value on error
export const attempt = <T>(fn: (arg: T) => T, fallback?: (arg: T) => T) => 
    (value: T): T => {
        try {
            return fn(value);
        } catch (error) {
            return fallback ? fallback(value) : value;
        }
    };

// Apply function only if value passes predicate
export const filter = <T>(predicate: (arg: T) => boolean, fn: (arg: T) => T) => 
    (value: T): T => predicate(value) ? fn(value) : value;

// Apply different functions based on value
export const branch = <T>(predicate: (arg: T) => boolean, trueFn: (arg: T) => T, falseFn?: (arg: T) => T) => 
    (value: T): T => predicate(value) ? trueFn(value) : falseFn ? falseFn(value) : value;

// Compose functions (reverse of pipe)
export const compose = <T>(...fns: Array<(arg: T) => T>) => 
    (value: T): T => fns.reduceRight((acc, fn) => fn(acc), value);

// Identity function (useful for default cases)
export const identity = <T>(value: T): T => value;

// Constant function - always returns the same value
export const constant = <T>(constantValue: T) => (_: any): T => constantValue;

// Apply function with delay (useful for animations)
export const delay = <T>(ms: number, fn: (arg: T) => T) => 
    (value: T): T => {
        setTimeout(() => fn(value), ms);
        return value;
    };

// Memoize function results (cache based on input)
export const memoize = <T>(fn: (arg: T) => T) => {
    const cache = new Map<T, T>();
    return (value: T): T => {
        if (cache.has(value)) {
            return cache.get(value)!;
        }
        const result = fn(value);
        cache.set(value, result);
        return result;
    };
};
