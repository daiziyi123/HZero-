import { IConfig } from 'umi'; // ref: https://umijs.org/config/
import { join } from 'path';
import packages from './packages-config';

process.env.NOT_USE_MF_COMMON = 'true';
process.env.HZERO_LOW_MEN_BUILD = 'true';
process.env.HZERO_FRONT_MF='none';
process.env.ENVS_SAVE_PLACE = process.env.ENVS_SAVE_PLACE || 'index.html'; // 默认把环境变量保存到 dist/index.html 内, 修改 dist/index.html 将影响全局环境变量配置。

// 整体配置项参考umi配置 https://umijs.org/zh-CN/config
export default {
  hzeroUed: {
    //   dynamicLess: 'true',
  },
  webpack5: {}, // 必须开启
  // 配置主题，实际上是配 less 变量。
  theme: {
    'input-height-base': '28px',
    'btn-height-base': '28px',
    'font-size-base': '12px',
    'text-color': '#333',
    'border-radius-base': '2px',
    'primary-color': '#29BECE',
    'layout-header-height': '48px',
    'modal-mask-bg': 'rgba(0, 0, 0, 0.288)',
    'pagination-item-size': '26px',
    'form-item-margin-bottom': '14px',
    'icon-url': '/assets/hzero-ui/font_148784_v4ggb6wrjmkotj4i',
    // 'iconfont-css-prefix': 'c7n', // 设置 c7n 图标 class 前缀
  },
  // 是否启用按需加载
  dynamicImport: {
    loading: '@hzerojs/plugin-layout/browsers/components/PageLoading',
  },
  // 配置环境变量
  define: {
    'process.env': {
      CUSZ_CODE_BEFORE: 'KEY_FOCUS', // 个性化单元前缀
      LOV_CODE_BEFORE: 'MT', // lov值集前缀
      HMES_BASIC: '/key-focus-mes',
      TARZAN_COMMON: '/key-focus-tznc',
      HRPT_COMMON: '/hrpt',
      TARZAN_MODEL: '/key-focus-tznm',
      TARZAN_REPORT: '/tznr',
      TARZAN_METHOD: '/key-focus-tznd',
      TARZAN_SAMPLING: '/key-focus-tznq',
      TARZAN_HSPC: '/tzns',
      TARZAN_AIGC: '/aim',
      TARZAN_MONGO: '/tzng',
      TARZAN_HOHR: '/key-focus-mes',
      ADDITIONAL: process.env.ADDITIONAL,
      API_HOST: 'http://172.22.5.171:30080',
      PLATFORM_VERSION: 'SAAS',
      CLIENT_ID: 'localhost',
      MULTIPLE_SKIN_ENABLE: true,
      REACT_APP_SC_DISABLE_SPEEDY: 'false',
      SKIP_TS_CHECK_IN_START: false,
      SKIP_ESLINT_CHECK_IN_START: false,
      PACKAGE_PUBLIC_URL: '',
      // aps相关变量
      POOL_QUERY: 'query',
      APS_COMMON: '/key-focus-tznc',
      APS_METHOD: '/aps',
      APS_METHODTZND: '/tznd',
      BASE_SERVER: '/aps',
      BASE_SERVERPURCHASE: '/key-focus-aps-purchase',
      BASE_SERVERPLAN: '/key-focus-aps-mltp',
      TARZAN_METHODTZND: '/tznd',
      // ALM服务请求url前缀
      API_PREFIX: '/aori',
      // apaas服务
      AMAP_KEY: 'BUILD_AMAP_KEY',
      AMAP_JSCODE: 'BUILD_AMAP_JSCODE',
      AIGC_HOST: 'http://172.22.5.171:30088',
      // 低内存编译
      HZERO_LOW_MEN_BUILD: 'true',
      // 灵衍环境变量
      NOT_USE_MF_COMMON: 'true',
      VITE_BUILD_API_HOST: 'http://172.22.5.171:30080',
      VITE_BUILD_PUBLIC_URL: './',
      VITE_WORKFLOW_TARGET_URL: 'http://172.22.5.171:30080',
      TARZAN_EAM: '/eori',
    },
  },
  manifest: {
    basePath: '/',
  },
  presets: ['@hzerojs/preset-hzero'],
  plugins: [
    'hzero-front',
    '@hips/plugin-usein-hzeroapp',
    require.resolve('@hzerojs/plugin-vue'),
    require.resolve('hskp-mobile-plugin'),
  ],
  hzeroVue: {},
  hzeroUseHips: [
    {
      import: { name: 'apaas-mobile-provider', distDir: 'dist' },
      export: { name: 'mobile-provider', distDir: process.env.BUILD_DIST_PATH },
      usage: 'command',
      env: {
        HttpBaseUrl: 'BUILD_API_HOST', // 移动端基地址
        ClientId: 'BUILD_CLIENT_ID', // clientId，与PC使用同一个变量即可
      },
    },
    {
      import: { name: 'hzero-front-hwkf-mobile', distDir: 'dist' },
      export: { name: 'hzero-front-hwkf-mobile', distDir: process.env.BUILD_DIST_PATH },
      env: {
        // HttpHeader: '{}',
        // HttpNoauthBaseUrl: '',
        HttpBaseUrl: 'BUILD_API_HOST',
        BasePath: '/mobile',
        PublicPath: '/mobile',
        BktHwkf: 'hwkf',
        BktHwff: 'hwff',
        ClientId: 'BUILD_CLIENT_ID', // hzero后端所需要的客户端参数，一般情况下和PC端的CLIENT_ID一致
        ApaasMFUrl: 'BUILD_FEIDA_MOBILE_ACCESS_URL',
      },
    },
  ],
  alias: {
    components: 'hzero-front/lib/components',
    utils: 'hzero-front/lib/utils',
    services: 'hzero-front/lib/services',
    '@/assets': join(__dirname, '../src/assets'),
    '@config': join(__dirname, '../src/config'),
    '@hcbb': 'hcbb-front/lib',
    '@components': 'hcm-components-front/lib/components',
    '@services': 'hcm-components-front/lib/services',
    '@utils': 'hcm-components-front/lib/utils',
    '@assets': 'hcm-components-front/lib/assets',
    './hzero-front/lib/assets': 'hzero-front/lib/assets',
    'srm-front-cuz/lib': 'hzero-front-cusz/lib/components/Customize',
    'srm-front-cuz': 'hzero-front-cusz/lib/components/Customize',
    'srm-front-cuz/lib/h0Customize': 'hzero-front-cusz/lib/components/Customize/h0Customize',
  },
  hzeroMicro: {
    // modifyMfRemotesArrayConfig(remoteArr) {
    //   remoteArr.push('ali-table-fix-hd');
    //   if (process.env.ADDITIONAL !== 'true') {
    //     return remoteArr;
    //   }
    //   // c7n多版本的时候 ued的c7n也必须多版本 并且设置 mf-config
    //   const additionalArr = ['choerodon-ui', '@hzero-front-ui/c7n-ui'];

    //   return remoteArr.map(v => {
    //     if (additionalArr.includes(v)) {
    //       return [v, '145_hotfix'];
    //     }
    //     return v;
    //   });
    // },
    // 子模块配置 在这里面配置后当执行build:ms的时候可以选择到对应的子模块
    packages,
    // 配置公共模块，在打包的时候会预先编译公共模块
    common: [
      // {
      //   name: 'hcm-components-front',
      // },
    ],
    // 指定暴露出去的模块
    // mfExposes: {
    //   TestCom: '@/components/TestCom',
    // },
  },
  // 开启esbuild
  // esbuild: {},
  hash: true,
  // 同umi routes https://umijs.org/zh-CN/config#routes
  routes: [],
} as IConfig;
