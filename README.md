# SPR 铆接工艺管理前端（spr-front）

基于 HZero 前端框架的 SPR（自冲铆接）工艺管理应用，提供铆接工艺管理、终值分析、铆接曲线分析、窗口分析等功能模块。

## 功能模块

- **SPR 铆接工艺管理**：铆接工艺主入口菜单
- **仪表板**：工艺数据概览
- **终值分析**：铆接终值数据统计与分析
- **铆接曲线分析**：铆接过程曲线展示与分析
- **窗口分析**：铆接窗口数据分析
- **HMI 消息**：设备 HMI 消息查看

## 技术栈

- React 16 + TypeScript
- UMI 3（@umijs）
- HZero 前端框架（hzero-front）
- MobX + Dva 状态管理
- Lerna（monorepo 多包管理）
- Choerodon UI（c7n）+ Less

## 目录结构

```
bandlink-hand-frontend-main-v2/
├── bandlink-hand-frontend-main/
│   └── bl-takt-front/          # 主前端工程
│       ├── _mock/              # 系统级接口 Mock 数据
│       ├── config/             # 环境配置（dev/prod）
│       ├── packages/
│       │   └── key-bl-front/   # SPR 业务模块
│       ├── src/                # 应用入口与路由
│       └── package.json
├── contract-test-demo/         # 契约测试示例
└── vue3-vite-mock-demo/        # Vue3 + Vite Mock 示例
```

## 环境要求

- Node.js 16.x
- Yarn 1.x

## 安装依赖

在 `bandlink-hand-frontend-main/bl-takt-front` 目录下执行：

```bash
yarn --registry http://nexus.saas.hand-china.com/repository/hzero-npm-group/
```

## 本地启动

```bash
yarn start
```

启动后访问：http://localhost:8000

## 构建

```bash
# 构建主应用
yarn build

# 构建生产环境
yarn build:app:prod
```

## Mock 说明

项目在本地开发阶段使用 Mock 机制模拟后端接口，主要包括：

- 系统级接口 Mock：位于 `_mock/` 目录，通过 `src/setupProxy.ts` 注册
- 页面内本地数据：部分 SPR 页面直接内置展示数据

详细说明请参考 [项目Mock使用说明.md](./项目Mock使用说明.md)。
