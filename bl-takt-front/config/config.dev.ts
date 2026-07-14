/**
 * @Description:
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-06-14 10:18:31
 * @LastEditTime: 2023-06-15 11:52:21
 * @LastEditors: <yang.ni01@hand-china.com>
 */
import { IConfig } from 'umi'; // ref: https://umijs.org/config/

export default {
  define: {
    'process.env': {
      // API_HOST: 'http://172.22.5.87:30080', // POC环境
      // API_HOST: 'http://hcmapi.hand-china.com', // DEV环境
      // API_HOST: 'http://172.22.5.171:30080', // DEV环境
      API_HOST: 'http://182.92.131.109:30080', // 测试环境
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
      SRM_SSLM: '/key-focus-sqam',
      ADDITIONAL: process.env.ADDITIONAL,
      PLATFORM_VERSION: 'SAAS',
      CLIENT_ID: 'localhost',
      BASE_PATH: '/',
      MULTIPLE_SKIN_ENABLE: true,
      SKIP_NO_CHANGE_MODULE: true,
      REACT_APP_SC_DISABLE_SPEEDY: 'false',
      PACKAGE_PUBLIC_URL: '',
      SKIP_TS_CHECK_IN_START: true,
      // aps
      POOL_QUERY: 'query',
      // 服务的请求url前缀
      APS_COMMON: '/key-focus-tznc',
      APS_METHOD: '/aps',
      APS_METHODTZND: '/tznd',
      BASE_SERVER: '/key-focus-aps',
      BASE_SERVERPURCHASE: '/key-focus-aps-purchase',
      BASE_SERVERPLAN: '/key-focus-aps-mltp',
      TARZAN_METHODTZND: '/tznd',
      // ALM服务请求url前缀
      API_PREFIX: '/aori',
      // apaas服务
      APAAS_CLIENT_ID: 'BUILD_CLIENT_ID',
      TARZAN_EAM: '/eori',
    },
  },
} as IConfig;
