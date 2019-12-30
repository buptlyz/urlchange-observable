const instances: MethodChain<any>[] = []

function getMethodChain<T>(context: T, methodName: keyof T) {
    return instances.find(i => i._context === context && i._methodName === methodName)
}

function getOrCreateMethodChain<T>(context: T, methodName: keyof T) {    
    let methodChain = getMethodChain(context, methodName)
    
    if (!methodChain) {
        methodChain = new MethodChain(context, methodName)
        instances.push(methodChain)
    }
    
    return methodChain
}

export default class MethodChain<T> {
    static add<C>(context: C, methodName: keyof C, overrideMethod: Function) {
        getOrCreateMethodChain(context, methodName).add(overrideMethod)
    }

    static remove<C>(context: C, methodName: keyof C, overrideMethod: Function) {
        const methodChain = getMethodChain(context, methodName)
        methodChain && methodChain.remove(overrideMethod)
    }

    _context: T
    _methodName: keyof T
    _originalMethodReference: T[keyof T]
    
    _methodChain: Function[]
    _boundMethodChain: Function[]
    _wrappedMethod: Function

    constructor(context: T, methodName: keyof T) {
        this._context = context
        this._methodName = methodName
        this._originalMethodReference = context[methodName]
        if (typeof context[methodName] !== 'function') {
            throw new TypeError(`${context[methodName]} is not a function`)
        }

        this._methodChain = []
        this._boundMethodChain = []
        this._wrappedMethod = (...args: any[]) => {
            const lastOverwriteMethod =
                this._boundMethodChain[this._boundMethodChain.length - 1]
            return lastOverwriteMethod(...args)
        }

        // TODO remove type any
        context[methodName] = this._wrappedMethod as any
    }

    add(overrideMethod: Function) {
        if (typeof overrideMethod !== 'function')
            throw new TypeError(`${overrideMethod} is not a function`)
        
        this._methodChain.push(overrideMethod)
        this.rebindMethodChain()
    }

    remove(overrideMethod: Function) {
        const index = this._methodChain.indexOf(overrideMethod)
        if (~index) {
            this._methodChain.splice(index, 1)
            if (this._methodChain.length > 0) {
                this.rebindMethodChain()
            } else {
                this.destroy()
            }
        }
    }

    rebindMethodChain() {
        this._boundMethodChain = []
        for (let method, i = 0; method = this._methodChain[i]; i++) {
            const prevMethod = this._boundMethodChain[i - 1] ||
                (this._originalMethodReference as any).bind(this._context)
            const newBoundMethod = method(prevMethod)
            if (typeof newBoundMethod !== 'function')
                throw new TypeError(`${method(prevMethod)} is not a function`)
            this._boundMethodChain.push(newBoundMethod)
        }
    }

    destroy() {
        const index = instances.indexOf(this)
        if (~index) {
            instances.splice(index)
            this._context[this._methodName] = this._originalMethodReference
        }
    }
}