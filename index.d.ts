import Observable from 'observable';
export declare type Options = {
    shouldEmitUrlChange?: (oldPath: string, newPath: string) => boolean;
    trackReplaceState?: boolean;
};
export declare function urlchangeObservableFactory(options?: Options): Observable;
declare const _default: Observable;
export default _default;
