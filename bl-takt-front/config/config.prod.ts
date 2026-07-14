import { IConfig } from 'umi'; // ref: https://umijs.org/config/

export default {
  define: {
    'process.env': {
      CUSZ_CODE_BEFORE: 'BUILD_CUSZ_CODE_BEFORE', // 个性化单元前缀
      LOV_CODE_BEFORE: 'BUILD_LOV_CODE_BEFORE', // lov值集前缀
      HMES_BASIC: 'BUILD_HMES_BASIC',
      TARZAN_COMMON: 'BUILD_TARZAN_COMMON',
      HRPT_COMMON: 'BUILD_HRPT_COMMON',
      TARZAN_MODEL: 'BUILD_TARZAN_MODEL',
      TARZAN_REPORT: 'BUILD_TARZAN_REPORT',
      TARZAN_METHOD: 'BUILD_TARZAN_METHOD',
      TARZAN_SAMPLING: 'BUILD_TARZAN_SAMPLING',
      TARZAN_HSPC: 'BUILD_TARZAN_HSPC',
      TARZAN_AIGC: 'BUILD_TARZAN_AIGC',
      TARZAN_MONGO: 'BUILD_TARZAN_MONGO',
      TARZAN_HOHR: 'BUILD_TARZAN_HOHR',
      API_HOST: 'BUILD_API_HOST',
      PLATFORM_VERSION: 'BUILD_PLATFORM_VERSION',
      CLIENT_ID: 'BUILD_CLIENT_ID',
      BASE_PATH: 'BUILD_BASE_PATH',
      SRM_SSLM: 'BUILD_SRM_SSLM',
      PUBLIC_URL: '/',
      WEBSOCKET_HOST: 'BUILD_WEBSOCKET_HOST',
      PACKAGE_PUBLIC_URL: 'BUILD_PACKAGE_PUBLIC_URL',
      // aps
      POOL_QUERY: 'BUILD_POOL_QUERY',
      APS_COMMON: 'BUILD_APS_COMMON',
      APS_METHOD: 'BUILD_APS_METHOD',
      APS_METHODTZND: 'BUILD_APS_METHODTZND',
      BASE_SERVER: 'BUILD_BASE_SERVER',
      BASE_SERVERPURCHASE: 'BUILD_BASE_SERVERPURCHASE',
      BASE_SERVERPLAN: 'BUILD_BASE_SERVERPLAN',
      TARZAN_METHODTZND: 'BUILD_TARZAN_METHODTZND',
      SKIP_NO_CHANGE_MODULE: true,
      // ALM服务请求url前缀
      API_PREFIX: 'BUILD_API_PREFIX',
      // apaas服务
      MOBILE_API_HOST: 'BUILD_API_HOST',
      MOBILE_PREVIEWER_HOST: 'BUILD_MOBILE_PREVIEWER_HOST',
      FEIDA_MOBILE_ACCESS_URL: 'BUILD_MOBILE_PREVIEWER_HOST',
      // 工作流移动端所需环境变量
      VUE_APP_HTTP_BASE_URL: 'BUILD_VUE_APP_HTTP_BASE_URL',
      // AIGC所需环境变量
      AIGC_HOST: 'BUILD_AIGC_HOST',
      // 不确定2.9飞搭有无用处，后续可能会删除
      APAAS_CLIENT_ID: 'BUILD_CLIENT_ID',
      // 灵衍环境变量
      VITE_BUILD_API_HOST: 'BUILD_API_HOST',
      VITE_BUILD_PUBLIC_URL: './',
      VITE_WORKFLOW_TARGET_URL: 'BUILD_VUE_APP_HTTP_BASE_URL',
      TARZAN_EAM: 'BUILD_TARZAN_EAM',
    },
  },
  hzeroMicro: {
    mfGlobalConfig: {
      remotesConfig: {
        // 特异性包将和其所在的子模块工程打包，在其所在服务器中
        // 'choerodon_ui_145_hotfix': 'http://172.23.16.131:31108/packages/choerodon_ui_145_hotfix',
        // 'hzero-front-ui_c7n-ui_145_hotfix': 'http://172.23.16.131:31108/packages/hzero-front-ui_c7n-ui_145_hotfix',
      },
    },
  },
} as IConfig;
