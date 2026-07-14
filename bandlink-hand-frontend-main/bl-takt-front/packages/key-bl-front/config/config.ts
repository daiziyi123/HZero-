import { extendParentConfig } from '@hzerojs/plugin-micro';

export default extendParentConfig({
  webpack5: {},
  routes: [
    {
      path: '/SPR',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/SPR/',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/spr',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/spr/',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/SPR',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/SPR/',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/spr',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/spr/',
      name: '铆接曲线',
      title: '铆接曲线',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/dashboard',
      name: '仪表板',
      title: '仪表板',
      authorized: true,
      component: '@/routes/SPR',
    },
    {
      path: '/voyahRF/final-value',
      name: '铆接终值',
      title: '铆接终值',
      authorized: true,
      component: '@/routes/FinalValue',
    },
    {
      path: '/voyahRF/window-analysis',
      name: '窗口分析',
      title: '窗口分析',
      authorized: true,
      component: '@/routes/WindowAnalysis',
    },
    {
      path: '/voyahRF/hmi-message',
      name: 'HMI消息',
      title: 'HMI消息',
      authorized: true,
      component: '@/routes/SPR',
    },
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
      // 主模块下microServices下registerRegex优先级最高
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
