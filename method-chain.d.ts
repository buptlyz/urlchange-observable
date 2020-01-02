export default class MethodChain<T> {
    static add<C>(context: C, methodName: keyof C, overrideMethod: Function): void;
    static remove<C>(context: C, methodName: keyof C, overrideMethod: Function): void;
    _context: T;
    _methodName: keyof T;
    _originalMethodReference: T[keyof T];
    _methodChain: Function[];
    _boundMethodChain: Function[];
    _wrappedMethod: Function;
    constructor(context: T, methodName: keyof T);
    add(overrideMethod: Function): void;
    remove(overrideMethod: Function): void;
    rebindMethodChain(): void;
    destroy(): void;
}
