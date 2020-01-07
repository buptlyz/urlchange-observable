# urlchange-observable

## usage

```typescript
import observable, { urlchangeObservableFactory } from 'urlchange-observable'

const observable2 = urlchangeObservableFactory({
    shouldEmitUrlChange: (oldPath, newPath) => oldPath !== newPath, // default !!(oldPath && newPath)
    trackReplaceState: false, // default true
})
observable.subscribe(console.log)
observable2.subscribe(console.log)
```

推荐使用工厂函数创建自己的`observable`，按需传入配置。
