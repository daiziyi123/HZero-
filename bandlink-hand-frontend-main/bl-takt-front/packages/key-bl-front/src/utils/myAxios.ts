import axios, { AxiosRequestConfig } from 'axios';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { API_HOST, BASE_SERVER } from '@/utils/constants';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';

interface RequesetAction {
  successMes: boolean; // 操作成功是否提醒
  successCallback: (res: any) => void; // 操作成功后的回调
  failCallback: () => void; // 操作失败后的回调
}
declare type AfterRequest = Partial<RequesetAction>;

interface PostConfig extends AfterRequest {
  url: string;
  params: any; // 操作参数
}

interface GetConfig extends AfterRequest {
  url: string;
  params?: any; // 操作参数
}

const myInstance = axios.create({
  baseURL: API_HOST,
  timeout: 300000,
  headers: {
    authorization: `Bearer ${getAccessToken()}`,
    responseType: 'json',
    accept: 'application/json, text/plain, */*',
  },
});

export const featchDataPost = async (basic: PostConfig, config?: AxiosRequestConfig) => {
  let middleUrl = basic.url || '';
  if (middleUrl.indexOf('/v1/') < 0) {
    middleUrl = `${BASE_SERVER}/v1/${getCurrentOrganizationId()}/${middleUrl}`;
  }
  const res = await myInstance.post(middleUrl, basic.params, config);
  if (res && res.data && res.data.success) {
    if (basic.successMes) {
      notification.success({
        message: intl.get('tarzan.aps.common.notification.success').d('操作成功'),
        description: '',
      });
    }
    if (basic.successCallback) {
      basic.successCallback(res.data.rows);
    }
    return res.data;
  } else {
    if (res && res.data && res.data.message) {
      notification.error({
        message: res.data.message,
        description: '',
      });
    }
    if (basic.failCallback) {
      basic.failCallback();
    }
    return null;
  }
};

export const featchDataGet = async (basic: GetConfig, config?: AxiosRequestConfig) => {
  let middleUrl = basic.url || '';
  if (middleUrl.indexOf('/v1/') < 0) {
    middleUrl = `${BASE_SERVER}/v1/${getCurrentOrganizationId()}/${middleUrl}`;
  }
  const res = await myInstance.get(middleUrl, config);
  if (res && res.data && (res.data.success || Array.isArray(res.data))) {
    if (basic.successMes) {
      notification.success({
        message: intl.get('tarzan.aps.common.notification.success').d('操作成功'),
      });
    }
    if (basic.successCallback) {
      basic.successCallback(res.data.rows || res.data);
    }
    return res.data;
  } else {
    if (res && res.data && res.data.message) {
      notification.error({
        message: res.data.message,
      });
    }
    if (basic.failCallback) {
      basic.failCallback();
    }
    return null;
  }
};

export default myInstance;
