/**
 * @Description: 封装请求的hook
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @Date: 2021-08-09 15:16:20
 * @LastEditTime: 2022-04-08 15:57:49
 * @LastEditors: <ruiqi.jiang01@hand-china.com>
 */

import { useState, useEffect, useCallback } from 'react';
import { isFunction, isPlainObject } from 'lodash';
import request from 'utils/request';
import { HZERO_PLATFORM } from 'utils/config';
import { getCurrentOrganizationId } from 'utils/utils';
import { getResponse } from '@/utils/utils';

const tenantId = getCurrentOrganizationId();

// 防抖
const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer); // 先清除定时器
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// 节流
const throttle = (fn: Function, duration: number) => {
  let flag = true;
  let funtimer: NodeJS.Timeout;
  return (...args: any[]) => {
    if (flag) {
      fn(...args);
    }
    flag = false;
    clearTimeout(funtimer);
    funtimer = setTimeout(() => {
      flag = true;
    }, duration);
  };
};

export interface RequestParams {
  url?: string;
  lovCode?: string;
  method?: string;
  query?: any;
  body?: any;
}
export interface RequestConfig {
  manual?: boolean;
  initialData?: any;
  showNotification?: boolean;
  debounceInterval?: number;
  throttleInterval?: number;
  loadingDelay?: number;
  needPromise?: boolean;
}

export interface RunnerParams {
  params?: object;
  queryParams?: object;
  tempUrl?: string;
  onSuccess?: (value: any) => void;
  onFailed?: (value: any) => void;
}

export interface RequestReturn {
  loading: boolean;
  data: any;
  error: string | null;
  run: (args: RunnerParams) => any;
  mutate: (data: any) => void;
}

/**
 * @name useRequest 封装请求的hook
 *
 * @param param 请求参数
 * @member
 * | 属性 | 说明 | 类型 | 默认值 |
 *
 * | url | 请求url | string | - |
 *
 * | lovCode | lov值集编码，使用lovCode后不会使用其他属性进行查询 | string | - |
 *
 * | method | 请求方法 | string | - |
 *
 * | query | 查询参数（url中的查询参数）| object | {} |
 *
 * | body | 查询参数（请求body中的查询参数）| object | {} |
 *
 * @param config 钩子的配置项
 * @member
 * | initialData | 给data设置初始值 | any | - |
 *
 * | throttleInterval | 节流时间间隔，默认使用节流（请求发送后，一段时间内不会再次发起）| number | 600 |
 *
 * | debounceInterval | 防抖时间间隔，建议使用节流| number | 600 |
 *
 * | showNotification | 是否自动弹报错提示 | boolean | true |
 *
 * | loadingDelay | 延迟 loading 变为 false 的时间，防止页面可能出现的闪烁 | number | 200 |
 *
 * | manual | 是否手工查询，true 时初始化不进行查询 | boolean | false |
 *
 * | needPromise | 使用run方法手动执行时，是否需要返回Promise， true 时不会使用防抖或节流 | boolean | false |
 *
 * | pollingInterval | TODO 轮询 | number | 10000 |
 *
 * @return {} {loading,data,error,run,mutate}
 * @member
 * | data | 接口返回的数据 | any | null |
 *
 * | loading | 查询状态，是否正在请求 | boolean | false |
 *
 * | error | 如果接口报错，报错信息在这 | string/null | null |
 *
 * | run | 手动查询，需设置manual: true | function |  |
 *
 * | mutate | 直接修改data 与useState的set用法一致 | function | (newData) => void / ((oldData)=>newData) => void |
 *
 * @memberof run 手动查询函数的参数信息
 * params | 手动查询时添加的查询参数，get请求会加到url中，post请求会加到body中 | object | {} |
 *
 * queryParams | 手动查询时添加的查询参数，会加到url中 | object | {} |
 *
 * onSuccess | 请求成功的回调 | functiong |  (value) => { } |
 *
 * onFailed | 请求失败的回调 | functiong |  (value) => { } |
 */
const useRequest = (param: RequestParams, config: RequestConfig = {}): RequestReturn => {
  const { url, lovCode, ...requestInitParams } = param;
  const {
    manual,
    initialData,
    showNotification = true,
    debounceInterval = 600,
    throttleInterval = 600,
    loadingDelay = 200,
    needPromise = false,
  } = config;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setLoading(false);
      setResult(null);
      setError(null);
    };
  }, []);

  const _runner = (runnerParams: RunnerParams = {}) => {
    const { params, queryParams, tempUrl, onSuccess, onFailed } = runnerParams;
    setLoading(true);
    let queryUrl = tempUrl || url;
    let queryOptions = { ...requestInitParams };
    queryOptions.query = { ...queryOptions.query, ...queryParams };
    if (requestInitParams.method === 'GET') {
      queryOptions.query = { ...queryOptions.query, ...params };
    }
    if (requestInitParams.method === 'POST') {
      if (isPlainObject(params)) {
        queryOptions.body = { ...queryOptions.body, ...params };
      } else {
        queryOptions.body = params;
      }
    }
    if (lovCode) {
      queryUrl = `${HZERO_PLATFORM}/v1/${tenantId}/lovs/data`;
      queryOptions = {
        method: 'GET',
        query: {
          lovCode,
          tenantId,
          ...queryOptions.query,
        },
      };
    }
    return request(queryUrl, queryOptions)
      .then((response: any) => {
        const res = getResponse(response, showNotification, true);
        if (lovCode) {
          setResult(res);
          if (isFunction(onSuccess)) {
            // 由于值集查询返回值只有一个列表，所以直接返回
            onSuccess(res);
          }
        } else {
          setResult(res.rows);
        }
        setError(res.message);
        if (isFunction(onSuccess) && res.success) {
          onSuccess(res.rows);
        }
        if (isFunction(onFailed) && !res.success) {
          onFailed(res.rows);
        }
        return res;
      })
      .catch((res: any) => {
        // eslint-disable-next-line no-console
        console.error(res);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, loadingDelay);
      });

    // 做前台超时，但如果取消了请求，平台的上层request里会直接报错
  };

  useEffect(() => {
    if (!manual) {
      _runner();
    }
  }, []);

  const throttleRunner = useCallback(throttle(_runner, throttleInterval), []);
  const debounceRunner = useCallback(debounce(_runner, debounceInterval), []);

  const run = (args: RunnerParams) => {
    if (needPromise) {
      return _runner(args);
    }
    if (throttleInterval) {
      throttleRunner(args);
      return Promise.resolve(null);
    } else {
      debounceRunner(args);
      return Promise.resolve(null);
    }
  };

  const mutate = (data: any) => {
    if (typeof data === 'function') {
      setResult(data(result) || {});
    } else {
      setResult(data);
    }
  };

  return {
    loading,
    data: result,
    error,
    run,
    mutate,
  };
};

export default useRequest;
