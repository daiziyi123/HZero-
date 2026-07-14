# 项目中的 Mock 使用说明

本项目在本地开发阶段使用了 Mock 机制，用于在真实后端接口不可用、接口不稳定或需要快速展示页面时，向前端提供模拟数据。项目中的 Mock 主要分为两类：一类是系统级接口 Mock，另一类是页面内本地 Mock 数据。

系统级 Mock 位于 `bandlink-hand-frontend-main/bl-takt-front/_mock/` 目录下。该目录中包含 `_mock/index.js`、`_mock/_mock-data/menuData.js`、`lovData.js`、`lovView.js` 以及 `iam/user.js` 等文件。其中，`menuData.js` 主要用于模拟系统菜单数据，例如 SPR 铆接工艺管理、终值分析、铆接曲线分析等菜单入口；`lovData.js` 和 `lovView.js` 用于模拟值集、下拉框和 LOV 视图数据；`iam/user.js` 则用于模拟用户信息、权限和菜单相关接口。

这些 Mock 接口并不是自动生效的，而是通过 `src/setupProxy.ts` 注册到本地开发服务中。该文件中使用 `mocker-api` 加载 `_mock/index.js`，使本地开发服务器能够拦截部分接口请求，并返回 `_mock` 中定义的模拟数据。因此，`setupProxy.ts` 可以理解为 Mock 数据和前端请求之间的桥梁。

需要注意的是，SPR 页面当前的数据来源并不完全来自 `_mock` 目录。`packages/key-bl-front/src/routes/SPR/index.tsx` 中直接定义了部分本地数据，例如曲线列表、指标卡片数据和曲线点数据。这类数据属于页面内 Mock，主要用于页面展示和交互调试。它的优点是实现快速，适合开发早期验证页面效果；缺点是与页面耦合较强，后续切换真实接口时需要调整页面数据来源。

SPR 模块中还存在 `services/index.ts`，其中封装了 `getSPRMetrics`、`getSPRChartData`、`getSPRTableData` 等接口方法，请求路径为 `/tarzan/v1/{organizationId}/spr/...`。这些方法更接近真实后端接口调用，但当前 SPR 页面并未真正使用这些 service 方法，且 `_mock` 中也没有看到对应的 SPR 接口 Mock。

总体来看，本项目已经使用了 Mock：系统菜单、权限、LOV 等数据通过 `_mock` 提供；SPR 页面展示数据主要通过页面内写死数据提供。后续如果要接入真实后端，建议将 SPR 页面内数据逐步迁移到 `services/index.ts` 中，通过统一接口请求获取数据，并确保本地代理或 `_mock` 中存在对应接口，方便在 Mock 和真实后端之间平滑切换。
