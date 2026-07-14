### 使用示例

```tsx
const {
  data, // 接口返回的数据
  loading, // 查询状态
  error, // 如果接口报错，报错信息在这
  run, // 手动查询，需设置manual: true
  mutate, // 直接修改data 与useState的set用法一致 (newData) => void / ((oldData)=>newData) => void
} = useRequest({
  url: `${BASIC.HMES_BASIC}/v1/${tenantId}/xxxx/xxxx/ui`, // 请求url
  lovCode, // lov值集编码
  method: 'GET', // 请求方法
  query: {}, // 查询参数（url中的查询参数）
  body: {}, // 查询参数（请求body中的查询参数）
}, {
  initialData, // 默认的data
  throttleInterval: 600, // 节流时间间隔，默认使用节流（请求发送后，一段时间内不会再次发起）
  debounceInterval: 600, // 防抖时间间隔，建议使用节流
  showNotification: true, // 是否自动弹报错提示
  loadingDelay: 200, // 延迟 loading 变为 false 的时间，防止页面可能出现的闪烁
  manual: false, // 是否手工查询，true 时初始化不进行查询
  needPromise: false, // 使用run方法手动执行时，是否需要返回Promise， true 时不会使用防抖或节流
  pollingInterval: 1000, // TODO 轮询
});
run({
  params: {}, // 手动查询时添加的查询参数，get请求会加到url中，post请求会加到body中
  queryParams: {}, // 手动查询时添加的查询参数，会加到url中
  tempUrl: '', // 仅用于档次请求的url
  onSuccess: (value) => { }, // 请求成功的回调
  onFailed: (value) => { }, // 请求失败的回调
});
```

### 参数文档介绍
```js

/**
* @name useRequest 封装请求的hook
* 
* @param param 请求参数
* @member
* | 属性 | 说明 | 类型 | 默认值 |
* 
* | url | 请求url | string | - |
* 
* | lovCode | lov值集编码，使用lovCode后不会使用其他属性进行查询 | string | - |
* 
* | method | 请求方法 | string | - |
* 
* | query | 查询参数（url中的查询参数）| object | {} |
* 
* | body | 查询参数（请求body中的查询参数）| object | {} |
* 
* @param config 钩子的配置项
* @member
* | initialData | 给data设置初始值 | any | - |
* 
* | throttleInterval | 节流时间间隔，默认使用节流（请求发送后，一段时间内不会再次发起）| number | 600 |
* 
* | debounceInterval | 防抖时间间隔，建议使用节流| number | 600 |
* 
* | showNotification | 是否自动弹报错提示 | boolean | true |
* 
* | loadingDelay | 延迟 loading 变为 false 的时间，防止页面可能出现的闪烁 | number | 200 |
* 
* | manual | 是否手工查询，true 时初始化不进行查询 | boolean | false |
* 
* | needPromise | 使用run方法手动执行时，是否需要返回Promise， true 时不会使用防抖或节流 | boolean | false |
* 
* | pollingInterval | TODO 轮询 | number | 10000 |
* 
* @return {} {loading,data,error,run,mutate}
* @member
* | data | 接口返回的数据 | any | null |
* 
* | loading | 查询状态，是否正在请求 | boolean | false |
* 
* | error | 如果接口报错，报错信息在这 | string/null | null |
* 
* | run | 手动查询，需设置manual: true | function |  |
* 
* | mutate | 直接修改data 与useState的set用法一致 | function | (newData) => void / ((oldData)=>newData) => void |
* 
* @memberof run 手动查询函数的参数信息
* params | 手动查询时添加的查询参数，get请求会加到url中，post请求会加到body中 | object | {} |
* 
* queryParams | 手动查询时添加的查询参数，会加到url中 | object | {} |
* 
* onSuccess | 请求成功的回调 | functiong |  (value) => { } |
* 
* onFailed | 请求失败的回调 | functiong |  (value) => { } |
  */
```
