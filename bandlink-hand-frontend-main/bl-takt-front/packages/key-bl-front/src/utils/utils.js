/**
 * dong.li <dong.li04@hand-china.com>
 * @date 2021-8-17
 * @description 公共方法
 */
import { has, isArray, isEmpty, isObject, findIndex, isUndefined, isNull, forIn } from 'lodash';
import { getCurrentOrganizationId, getEditTableData, getAccessToken } from 'utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import qs from 'querystring';
import axios from 'axios';
import Cookies from 'universal-cookie';
import request from 'utils/request';
import { BASIC, API_HOST } from '@/utils/config';
import authorize from './authorize';

// 如何这里直接取得tenantId，有时在domtree没构建出来是，会报IOC错误，无法进入页面
let tenantId = '';

export const ACCESS_TOKEN = 'access_token';
const cookies = new Cookies();

/**
 * 用于改变表格数据行的编辑状态
 * @param {Object} record -表格选中的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 */
export function changeTableRowEditState(record, tableList, key) {
  return tableList.map((item) => {
    if (record[key] === item[key]) {
      return { ...item, _status: ['create', 'update'].includes(item._status) ? '' : 'update' };
    } else {
      return item;
    }
  });
}

/**
 * 行保存时，获取保存行的数据   ----return Object/'' || 行数据/未找到该行数据
 * @param {Object} record -表格选中的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 * @param {Array} flags -需要由true/false改为Y/N的flag
 */
export function getEditRecord(record, tableList, key, flags) {
  // @ts-ignore
  const EditList = getEditTableData(tableList, [key]);
  const index = findIndex(EditList, (o) => {
    return o[key] === record[key];
  });
  const params = EditList[index];
  if (flags && flags.length > 0) {
    flags.forEach((flag) => {
      params[flag] = params[flag] ? 'Y' : 'N';
    });
  }
  return params;
}

/**
 * 用保存后返回的行数据，替换原表格保存行数据
 * @param {Object} record -保存成功返回的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 */
export function updateTableRowData(record, tableList, key) {
  let index = findIndex(tableList, (o) => {
    // @ts-ignore
    return o[key] === record[key];
  });
  const newList = tableList;
  index = index === -1 ? 0 : index;
  Object.keys(record).forEach((objKey) => {
    newList[index][objKey] = record[objKey];
    newList[index]._status = '';
  });
  return newList;
}

/**
 *@functionName: ergodicData
 *@description 遍历对象
 *@author: 唐加旭
 *@date: 2019-08-30 14:24:49
 *@version: V0.0.1
 * */
export function ergodicData(origin) {
  // 判断是不是数组
  let item = origin;
  if (isArray(origin)) {
    for (let i = 0; i < origin.length; i++) {
      item[i] = ergodicData(origin[i]);
    }
  } else if (isObject(origin)) {
    // 判断是不是对象
    const keys = Object.keys(origin);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== '_tls') {
        item[keys[i]] = ergodicData(origin[keys[i]]);
      } else {
        item[keys[i]] = origin[keys[i]];
      }
    }
  } else if (isUndefined(origin)) {
    item = '';
  } else if (isNull(origin)) {
    item = '';
  }
  return item;
}

/**
 * 生成带Get参数的URL
 * @param {String} url      原来的url
 * @param {Object} params   get 参数
 */
export function generateUrlWithGetParam(url, params) {
  let newUrl = url;
  if (params && Object.keys(params).length >= 1) {
    const newParams = params; // filterNullValueObject
    if (Object.keys(newParams).length >= 1) {
      newUrl += `${url.indexOf('?') >= 0 ? '&' : '?'}${qs.stringify(newParams)}`;
    }
  }
  return newUrl;
}

// export function getAccessToken() {
//   // @ts-ignore
//   return cookies.get(ACCESS_TOKEN, { path: '/' });
// }

export function removeAccessToken() {
  cookies.remove(ACCESS_TOKEN, {
    path: '/',
  });
}

export function removeAllCookie() {
  forIn(cookies.getAll(), (_value, key) => {
    cookies.remove(key);
  });
}

/**
 * 过滤掉对象值为 undefined 和 空字符串 和 空数组 的属性
 * @author WH <heng.wei@hand-china.com>
 * @param {Object} obj
 * @returns {Object} 过滤后的查询参数
 */
export function filterNullValueObject(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach((key) => {
      if (key && obj[key] !== undefined && obj[key] !== '' && obj[key] !== null) {
        // 如果查询的条件不为空
        if (isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}

/**
 * 过滤掉对象值为 undefined 和 空数组 的属性，修改为空字符串
 * @param {Object} obj
 * @returns {Object} 过滤后的查询参数
 */
export function convertNullToEmptyString(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach((key) => {
      if (key && obj[key] !== undefined && obj[key] !== null) {
        // 如果查询的条件不为空
        if (isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      } else {
        result[key] = '';
      }
    });
  }
  return result; // 返回查询条件
}

// 某服务下使用站点相关信息需要在入口文件下调用此方法
export async function getDefaultSite() {
  const accessToken = getAccessToken();
  const defaultOptions = {
    credentials: 'include',
    Authorization: `bearer ${accessToken}`,
    headers: {
      Accept: 'application/json',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `bearer ${accessToken}`,
    },
  };
  if (!tenantId) {
    tenantId = await getCurrentOrganizationId();
  }
  if (!cookies.get('defaultSiteId')) {
    const res = await request(
      `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/user/default/site/ui`,
      defaultOptions
    );
    if (res.success && res.rows && res.rows.siteId && res.rows.siteCode) {
      cookies.set('defaultSiteId', res.rows.siteId, {
        path: '/',
      });
      cookies.set('defaultSiteCode', res.rows.siteCode, {
        path: '/',
      });
    }
  }
}

// 某服务下使用getSiteId需要在入口文件下调用getDefaultSite方法
export async function getSiteId() {
  if (cookies.get('defaultSiteId')) {
    return cookies.get('defaultSiteId');
  } else {
    // eslint-disable-next-line no-return-await
    await getDefaultSite().then((r) => console.log(r));
    return cookies.get('defaultSiteId');
  }
}

// 某服务下使用getSiteCode需要在入口文件下调用getDefaultSite方法
export async function getSiteCode() {
  if (cookies.get('defaultSiteCode')) {
    return cookies.get('defaultSiteCode');
  } else {
    // eslint-disable-next-line no-return-await
    await getDefaultSite().then((r) => console.log(r));
    return cookies.get('defaultSiteCode');
  }
}

/**
 * 判断传入参数是否是有值的对象
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 * @param {Object} obj
 * @returns {boolean} true/false
 */
export function verifyObjectHasValue(obj) {
  if (isObject(obj)) {
    for (const name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        return true;
      }
    }
    return false;
  }
  return false;
}

/**
 * 验证传入值是否为正整数
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 * @param {string} value
 * @returns {boolean} true/false
 */
export function verifyPositiveInteger(value) {
  const reg = /^\d+(?=\.{0,1}\d+$|$)/;
  return reg.test(value);
}

/**
 * 获取Url传参
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 * @param {string} paramName 参数名
 * @returns {string|object|undefined} 参数对应值，取不到返回undefined，不传参数返回含有所有值的对象
 */
export function getQueryParam(paramName) {
  let url = window.location.search;
  if (url.indexOf('?') === 1) {
    return;
  }
  url = url.substr(1);
  url = url.split('&');
  const _paramName = paramName || '';
  const nameres = {};
  // 获取全部参数及其值
  for (let i = 0; i < url.length; i++) {
    const info = url[i].split('=');
    if (info[0]) {
      nameres[info[0]] = decodeURI(info[1]);
    }
  }
  // 如果传入一个参数名称，就匹配其值
  if (_paramName) {
    return nameres[_paramName];
  }
  // 返回结果
  return nameres;
}

/**
 * 处理请求返回的报错异常
 * @exportexport
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 * @param {Object} response 异步请求取到返回的消息
 * @param {Boolean} showNotification 是否在返回报错时弹出提示
 * @param {Boolean} needReturnObj 是否需要在报错时返回结果
 * @returns
 */
export function getResponse(response, showNotification = true, needReturnObj = false) {
  /* 现在有两种返回报错，
    一种是正常报错，依据返回值response.success = false来判断
    另一种是后台代码出错，或者数据库出错，依据返回值response.failed = true来判断
  */
  if (!response) {
    if (needReturnObj) {
      return {};
    }
  }
  const msg = {
    message: intl.get('hzero.common.notification.error').d('操作失败'),
    description: response.message || '',
  };
  if (has(response, 'success') && !response.success) {
    //  依据success
    if (showNotification) {
      notification.error(msg);
    }
    if (needReturnObj) {
      return { message: response.message, rows: response.rows };
    }
  } else if (has(response, 'failed') && response.failed === true) {
    //  依据failed
    if (showNotification) {
      switch (response.type) {
        case 'info':
          notification.info(msg);
          break;
        case 'warn':
          notification.warning(msg);
          break;
        case 'error':
        default:
          notification.error(msg);
          break;
      }
    }
    if (needReturnObj) {
      return { message: response.message, rows: response.rows };
    }
  } else {
    return response;
  }
}

const totalRender = (total, range) => {
  return intl
    .get('hzero.common.pagination.total', {
      range1: range[0],
      range2: range[1],
      total,
    })
    .d(`显示 ${range[0]} - ${range[1]} 共 ${total} 条`);
};
export function createPagination(data) {
  if (data) {
    return {
      showSizeChanger: true,
      current: data.number ? data.number + 1 : 1,
      pageSize: data.size || 0,
      total: data.totalElements || 0,
      showTotal: totalRender,
    };
  }
}

export const searchCopy = (types, currentType, record, value) => {
  if (types.includes(currentType)) {
    if (isArray(value)) {
      const newValue = value.reduce((prev, next) => {
        const currentMiddle = next.replace(/\s+/g, ',');
        const current = currentMiddle.split(',');
        return [...prev, ...current];
      }, []);
      const result = newValue.filter((child) => !isEmpty(child));
      record.set(currentType, result);
    }
  }
};

export const instance = axios.create({
  timeout: 30000,
  baseURL: API_HOST,
});

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|PERMISSION_ACCESS_TOKEN_EXPIRED)/;

instance.interceptors.request.use(
  (config) => {
    const newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers.Accept = 'application/json';
    if (newConfig.params) {
      const { pagesize, size } = newConfig.params;
      if (pagesize && !size) {
        newConfig.params.size = pagesize;
        delete newConfig.params.pagesize;
      }
    }
    const accessToken = getAccessToken();
    if (accessToken) {
      newConfig.headers.Authorization = `bearer ${accessToken}`;
    }
    return newConfig;
  },
  (err) => {
    const error = err;
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return response;
    }
    if (response.data.failed === true) {
      throw response.data;
    } else {
      return response;
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401: {
          removeAccessToken();
          authorize();
          break;
        }
        case 403: {
          if (regTokenExpired.test(response.data)) {
            removeAccessToken();
            authorize();
          }
          break;
        }
        default:
          break;
      }
    }
    throw error;
  }
);

export function getMenuInfoByRoute(route, menuData) {
  if (isObject(menuData) && menuData.type === 'inner-link') {
    return null;
  }
  if (isObject(menuData) && menuData.type === 'link') {
    return null;
  }

  // menuData 是数组
  if (isArray(menuData)) {
    for (let i = 0; i < menuData.length; i++) {
      const menu = getMenuInfoByRoute(route, menuData[i]);
      if (menu) {
        return menu;
      }
    }
  } else if (isObject(menuData) && isArray(menuData.children)) {
    // menuData 是 目录
    const menu = getMenuInfoByRoute(route, menuData.children);
    if (menu) {
      return menu;
    }
  } else if (isObject(menuData) && menuData.path) {
    const p = findCharNPosition(route.path, '/', countCharNum(menuData.path, '/') + 1);
    if (p === -1) {
      if (route.pathRegexp.test(menuData.path)) {
        return menuData; // 找到 菜单
      }
    } else if (route.pathRegexp.test(menuData.path + route.path.substr(p))) {
      return menuData; // 找到 菜单
    }
  }
  return null;
}

export function getMenuInfoByRouteForQuery(route, menuData) {
  if (isObject(menuData) && menuData.type === 'inner-link') {
    return null;
  }
  if (isObject(menuData) && menuData.type === 'link') {
    return null;
  }

  // menuData 是数组
  if (isArray(menuData)) {
    for (let i = 0; i < menuData.length; i++) {
      const menu = getMenuInfoByRouteForQuery(route, menuData[i]);
      if (menu) {
        return menu;
      }
    }
  } else if (isObject(menuData) && isArray(menuData.subMenus)) {
    // menuData 是 目录
    const menu = getMenuInfoByRouteForQuery(route, menuData.subMenus);
    if (menu) {
      return menu;
    }
  } else if (isObject(menuData) && menuData.route) {
    const p = findCharNPosition(route.path, '/', countCharNum(menuData.route, '/') + 1);
    if (p === -1) {
      if (route.pathRegexp.test(menuData.route)) {
        return menuData; // 找到 菜单
      }
    } else if (route.pathRegexp.test(menuData.route + route.path.substr(p))) {
      return menuData; // 找到 菜单
    }
  }
  return null;
}

function findCharNPosition(str, subStr, n) {
  if (!str || !subStr) {
    return 0;
  }
  let position = -1;
  let count = n;
  while (count !== 0) {
    position = str.indexOf(subStr, position + 1);
    count--;
  }
  return position;
}

function countCharNum(str, char) {
  if (!str || !char) {
    return 0;
  }
  let count = 0;
  for (const c of str) {
    if (c === char) {
      count++;
    }
  }
  return count;
}

export function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;

  // eslint-disable-next-line func-names
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        // eslint-disable-next-line no-multi-assign
        if (!timeout) context = args = null;
      }
    }
  };

  // eslint-disable-next-line func-names, no-shadow
  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      // eslint-disable-next-line no-multi-assign, no-param-reassign
      context = args = null;
    }

    return result;
  };
}

/*
 * @Description: 全屏效果
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-22 14:45:02
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-23 19:35:00
 * @Copyright: Copyright (c) 2019 Hand
 */
export function IEVersion() {
  // eslint-disable-next-line
  const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  return isIE || isIE11;
}

// 全屏
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export const fullScreenEnabled =
  document.fullScreenEnabled ||
  document.webkitFullScreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullScreenEnabled;

/**
 * 通过 路径 获取 路由
 * @param {*} pathname
 * @returns
 */
export const findRouteFromPathname = (pathname) => {
  const routesData = window?.dvaApp?._store?.getState()?.global?.routerData;
  const findRoute = routesData[pathname];
  return findRoute;
}
