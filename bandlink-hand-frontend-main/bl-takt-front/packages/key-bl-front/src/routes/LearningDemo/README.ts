/**
 * @Description: 路由配置说明
 * 
 * 需要在 packages/key-bl-front/config/config.ts 中添加路由配置
 * 
 * 添加以下配置：
 */

// 在 routes 数组中添加：
{
  // 页面路径（浏览器 URL）
  path: '/ipfm/learning-demo',
  // 是否需要权限验证（true 表示需要）
  authorized: true,
  // 组件路径（@ 代表 src 目录）
  component: '@/routes/LearningDemo',
}

/**
 * 完整示例：
 * 
 * export default extendParentConfig({
 *   webpack5: {},
 *   routes: [
 *     // ... 其他路由
 *     
 *     // 学习示例页面
 *     {
 *       path: '/ipfm/learning-demo',
 *       authorized: true,
 *       component: '@/routes/LearningDemo',
 *     },
 *   ],
 *   hash: true,
 *   // ... 其他配置
 * });
 */

/**
 * 国际化配置（可选）
 * 在对应的国际化文件中添加：
 * 
 * {
 *   'tarzan.learningDemo.title': '学习示例页面',
 *   'tarzan.learningDemo.demoCode': '编码',
 *   'tarzan.learningDemo.demoName': '名称',
 *   'tarzan.learningDemo.demoType': '类型',
 *   'tarzan.learningDemo.demoDate': '日期',
 *   'tarzan.learningDemo.remark': '备注',
 * }
 */
