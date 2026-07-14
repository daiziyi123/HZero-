import { extendParentConfig } from '@hzerojs/plugin-micro';

export default extendParentConfig({
  webpack5: {},
  routes: [
    // 车型维护
    {
      path: '/ipfm/vehicle-model-maintenance',
      authorized: true,
      component: '@/routes/VehicleModelMaintenance',
    },
    // 产线设备动作关系维护
    {
      path: '/ipfm/prod-line-equipment-action-relation',
      authorized: true,
      component: '@/routes/ProdLineEquipmentActionRelation',
    },
    //  产线车型工位节拍关系维护
    {
      path: '/ipfm/model-workcell-takt',
      authorized: true,
      component: '@/routes/ModelWorkcellTakt',
    },
    // 产线工位车型动作节拍关系维护
    {
      path: '/ipfm/model-action-takt',
      authorized: true,
      component: '@/routes/ModelActionTakt',
    },
    // 报警基础数据
    {
      path: '/ipfm/alarm-basic-data',
      authorized: true,
      component: '@/routes/AlarmBasicData',
    },
    // 学习示例页面
    {
      path: '/ipfm/learning-demo',
      authorized: true,
      component: '@/routes/LearningDemo',
    },

    // 健康管理：HI评分指标配置
    {
      path: '/ipfm/health-management',
      authorized: true,
      component: '@/routes/HealthManagement',
    },
    // 设备健康概览
    {
      path: '/ipfm/equipment-health-overview',
      authorized: true,
      component: '@/routes/EquipmentHealthOverview',
    },
    // 机器人综合健康概览
    {
      path: '/ipfm/comprehensive-health-overview',
      authorized: true,
      component: '@/routes/ComprehensiveHealthOverview',
    },
    // 机器人详情
    {
      path: '/ipfm/robot-health-detail/:deviceId?',
      authorized: true,
      component: '@/routes/ComprehensiveHealthOverview/components/RobotDetail',
      title: '机器人详情',
    },
    // 设备基础数据
    {
      path: '/ipfm/robot-basic-data',
      authorized: true,
      component: '@/routes/RobotBasicData',
      title: '设备基础数据',
    },
    // 参数变更履历
    {
      path: '/ipfm/parameter-change-history',
      authorized: true,
      component: '@/routes/ParameterChangeHistory',
      title: '参数变更履历',
    },
    // 气缸综合健康总览
    {
      path: '/ipfm/cylinder-health-overview',
      authorized: true,
      component: '@/routes/CylinderHealthOverview',
      title: '气缸综合健康总览',
    },
    // 气缸综合健康总览 · 卡片点击跳转
    {
      path: '/ipfm/cylinder-health-detail/:deviceId?',
      authorized: true,
      component: '@/routes/CylinderHealthOverview/components/CylinderOverviewDetail',
      title: '气缸综合健康总览',
    },
    // 气缸详情 · 菜单独立页
    {
      path: '/ipfm/cylinder-detail/:deviceId?', // 	/ipfm/cylinder-detail
      authorized: true,
      component: '@/routes/CylinderHealthOverview/components/CylinderDetail',
      title: '气缸详情',
    },
    // 伺服电机综合健康总览
    {
      path: '/ipfm/servo-health-overview',
      authorized: true,
      component: '@/routes/ServoHealthOverview',
      title: '伺服电机综合健康总览',
    },
    // 伺服电机健康详情
    {
      path: '/ipfm/servo-health-detail/:deviceId?', // 	/ipfm/servo-health-detail
      authorized: true,
      component: '@/routes/ServoHealthOverview/components/ServoDetail',
      title: '伺服电机详情',
    },
    {
      path: '/himp/commentImport/:code',
      component: '@/components/CommentImport',
      authorized: true,
    },
  ],
  hash: true,
  hzeroMicro: {
    microConfig: {
      // registerRegex: '(\\/halm)|(\\/orderPerfomace)|(\\/pub/halm)',
      // 原先在.hzerorc.json使用的是"initLoad": true,现在使用的模块加载规则：当匹配到对应的路由后，才加载对应的模块。
      // 主模块下microServices下registerRegex优先级最高/bl-yh/v1/4/bl-tests
      registerRegex: '\\/.*',
    },
    mfExposes: {
      '_hzero_layout_cards:HLCT.QUICK_ENTER': '@/cards/InspectionQuickEnter',
      '_hzero_layout_cards:HLCT.SCAN_CARD': '@/cards/InspectionScanCard',
      '_hzero_layout_cards:HLCT.TASK_LIST': '@/cards/InspectionTaskList',
    },
  },
  // 如果存在发布 lib 包需求,可以解开该配置，对应 babelrc 中的内容
  // 注意若父模块与子模块都配置了module-resolver插件,请保证数组的第三个参数不能为同一个字符串或者都为空
  extraBabelPlugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
});
