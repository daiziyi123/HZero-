# 契约测试 Demo

这个示例用最少代码说明契约测试解决的问题：

> 消费方期望的接口结构，提供方真实返回的接口结构，必须保持一致。

## 运行

```powershell
cd E:\111\mock\contract-test-demo
npm test
```

## 示例结构

```text
contracts/user.contract.json      # 消费方定义的接口契约
consumer/userApi.js               # 前端调用方，按契约读取 data.id 和 data.name
provider/userProvider.js          # 后端提供方，真实返回接口数据
tests/provider-contract.test.js   # 契约测试，验证提供方是否满足契约
```

## 怎么看懂

契约文件要求 `/api/user/1` 返回：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "张三"
  }
}
```

如果后端把字段改成 `username`，前端还在读 `name`，页面就会出问题。契约测试可以提前发现这个问题。

你可以打开 `provider/userProvider.js`，把：

```js
name: '张三'
```

改成：

```js
username: '张三'
```

再运行：

```powershell
npm test
```

测试会失败。这就是契约测试的核心价值。
