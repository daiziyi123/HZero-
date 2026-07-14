/*
 * Config - 全局统一配置
 * @Author: jiangruiqi
 * @Date: 2019-05-09 14:31:38
 * @Last Modified by: dong.li
 * @Last Modified time: 2020.4.13
 */
// import { API_HOST as host } from 'utils/config';
// import { API_HOST as host } from 'hzero-front/lib/utils/config';

export const CLIENT_ID = `${process.env.CLIENT_ID}`;
export const API_HOST = `${process.env.API_HOST}`;
export const NETTY_WEBSOCKET_HOST = `${process.env.NETTY_WEBSOCKET_HOST}`;
// export const API_HOST = host;
export const HZERO_OAUTH = '/oauth';
export const HZERO_PLATFORM = '/hpfm';
export const HZERO_IAM = '/iam';
export const AUTH_HOST = `${API_HOST}${HZERO_OAUTH}`;
export const AUTH_URL = `${AUTH_HOST}/oauth/authorize?response_type=token&client_id=${CLIENT_ID}`;
export const AUTH_SELF_URL = `${API_HOST}${HZERO_IAM}/hzero/v1/users/self`;

export const BASIC = {
  TARZAN_SAMPLING: `${process.env.TARZAN_SAMPLING}`,
  HMES_BASIC: `${process.env.HMES_BASIC}`,
  TARZAN_COMMON: `${process.env.TARZAN_COMMON}`,
  TARZAN_MODEL: `${process.env.TARZAN_MODEL}`,
  HRPT_COMMON: `${process.env.HRPT_COMMON}`,
};

export const LIMS_HOST = '/key-lims';
export const TARZAN_HFLE = '/hfle';
export const TARZAN_HRPT = '/hrpt';
export const ReportHost = '/mes-report';
export const HostWeb = `${NETTY_WEBSOCKET_HOST}`;
// export const Host =
//   process.env.NODE_ENV === 'production' ? `${host}/mes` : 'http://dev.hzero.org:8080/mes';
