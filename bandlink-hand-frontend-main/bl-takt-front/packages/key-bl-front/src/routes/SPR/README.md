# SPR工作台

## 功能说明

SPR工作台是一个用于展示和分析生产线数据的仪表板页面，提供以下功能：

### 1. 指标卡片
- 展示8个关键性能指标（KPI）
- 每个指标卡片包含标签、数值和单位
- 支持不同的颜色区分不同指标

### 2. 数据趋势图表
- 使用ECharts实现多条线图表
- 展示5条生产线的数据趋势
- 支持交互式工具提示和图例切换

### 3. 时间序列数据表
- 展示各时间点的详细数据
- 支持行悬停效果
- 表头固定，数据区域可滚动

### 4. 过滤和控制
- 日期范围选择
- 生产线选择
- 查询、重置、导出功能

## 文件结构

```
SPR/
├── index.tsx           # 页面主组件
├── index.less          # 页面样式
├── services/
│   └── index.ts        # 服务请求接口
└── store/
    └── index.ts        # 状态管理配置
```

## 使用方法

### 1. 安装依赖（如需）
项目已包含以下依赖：
- echarts@^4.8.0
- echarts-for-react@^2.0.14
- choerodon-ui/pro（表单、选择器等组件）

### 2. 路由访问
由于使用Umi文件夹路由，该页面会自动生成路由：
- 路由路径：`/spr`（需要根据您的菜单配置调整）

### 3. 数据集成

#### 使用本地Mock数据（当前实现）
目前使用的是本地Mock数据，可以在 `index.tsx` 中的 `mockMetrics` 和 `mockChartData` 修改。

#### 集成实际API
如需集成真实API，请：

1. 修改 `services/index.ts` 中的API地址和参数
2. 在 `index.tsx` 中使用 `useRequest` 钩子调用服务
3. 更新Mock数据为API返回的数据

示例：
```typescript
import { useRequest } from '@components/tarzan-hooks';
import { getSPRMetrics, getSPRChartData } from './services';

const { data: metricsData } = useRequest(getSPRMetrics);
const { data: chartData } = useRequest(getSPRChartData);
```

## 样式说明

- **控制卡片**：顶部的过滤和操作栏
- **指标卡片**：网格布局，响应式设计
- **图表容器**：ECharts图表渲染区域
- **数据表格**：带斑马纹和悬停效果的表格

## 响应式设计

页面采用Choerodon UI的栅栏系统：
- XS (< 576px)：单列布局
- SM (≥ 576px)：双列布局
- MD (≥ 768px)：根据需要调整列宽
- LG (≥ 992px)：完整布局

## 国际化

使用 `intl.get()` 支持多语言：
```typescript
intl.get('tarzan.sprWorkbench.title').d('SPR工作台')
```

配合 `formatterCollections` 装饰器进行国际化消息注册。

## 扩展建议

1. **添加更多图表类型**：柱状图、饼图等
2. **实现数据导出**：支持Excel、PDF格式
3. **添加实时更新**：使用WebSocket或定时轮询
4. **权限控制**：基于用户角色的数据隐藏
5. **自定义仪表板**：允许用户自主选择显示的指标

## 常见问题

### 图表不显示？
- 检查ECharts库是否正确安装
- 确保图表容器有正确的高度和宽度
- 查看浏览器控制台是否有错误信息

### 样式错乱？
- 确保 `index.less` 被正确导入
- 检查全局样式是否冲突
- 验证Less编译器配置

### 数据不更新？
- 确认API返回正确的数据格式
- 检查状态管理器是否正确配置
- 查看网络请求是否成功
