import Observable from 'lobservable';
export declare type Options = {
    shouldEmitUrlChange?: (oldPath: string, newPath: string) => boolean;
    trackReplaceState?: boolean;
};
export default function createUrlchangeObservable(options?: Options): Observable;
