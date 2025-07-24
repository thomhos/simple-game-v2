export function pipe<T>(value: T, ...fns: Array<(arg: T) => T>): T {
    return fns.reduce((acc, fn) => fn(acc), value);
}

// Conditional function application
export const when =
    <T>(condition: boolean, fn: (arg: T) => T) =>
    (value: T): T =>
        condition ? fn(value) : value;
