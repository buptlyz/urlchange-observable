import Observable, { Observer } from 'observable'
import MethodChain from 'override-chain'

export type Options = { 
    shouldEmitUrlChange?: (oldPath: string, newPath: string) => boolean
    trackReplaceState?: boolean
}

function getPath() {
    const { pathname, search, hash } = location
    return pathname + search + hash
}

function defaultShouldEmitUrlChange(oldPath: string, newPath: string) {
    return !!(oldPath && newPath)
}

export function urlchangeObservableFactory(options: Options = {}): Observable {
    const {
        shouldEmitUrlChange = defaultShouldEmitUrlChange,
        trackReplaceState = true,
    } = options

    return new Observable((observer: Observer) => {
        let path = getPath()
    
        function pushStateOverride(originalMethod: Function) {
            return (...args: any[]) => {
                originalMethod(...args)
                handler(true)
            }
        }
    
        function replaceStateOverride(originalMethod: Function) {
            return (...args: any[]) => {
                originalMethod(...args)
                handler(false)
            }
        }
        
        function handlePopState() {
            handler(true)
        }
        
        function handler(historyDidUpdate: Boolean) {
            setTimeout(() => {
                const newPath = getPath()
                if (path !== newPath && shouldEmitUrlChange(path, newPath)) {
                    path = newPath

                    if (historyDidUpdate || trackReplaceState) {
                        observer.next({ page: path })
                    }
                }
            })
        }
    
        MethodChain.add(history, 'pushState', pushStateOverride)
        MethodChain.add(history, 'replaceState', replaceStateOverride)
        window.addEventListener('popstate', handlePopState)
    
        return () => {
            MethodChain.remove(history, 'pushState', pushStateOverride)
            MethodChain.remove(history, 'replaceState', replaceStateOverride)
            window.removeEventListener('popstate', handlePopState)
        }
    })
}

export default urlchangeObservableFactory()