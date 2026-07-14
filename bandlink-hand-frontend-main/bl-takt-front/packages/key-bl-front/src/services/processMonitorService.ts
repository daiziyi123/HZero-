import request from 'utils/request';
import { getResponse } from 'utils/utils';
import { HZERO_HWKF } from 'utils/config';
import { getUrlPath } from 'hzero-front-hwkf/lib/utils';

const urlPath = getUrlPath();

export async function batchDelegateService({ query, body }, cb) {
  const res = await request(`${HZERO_HWKF}/v1/${urlPath}monitor-process/batch-delegate`, {
    method: 'POST',
    query,
    body,
  });
  if (getResponse(res)) {
    cb(res);
  }
}
export function retryService(body) {
  return request(`${HZERO_HWKF}/v1/${urlPath}run-exceptions/retry`, {
    method: 'POST',
    body,
    responseType: 'text',
  });
}
export function retryAllService(body, instanceId) {
  return request(`${HZERO_HWKF}/v1/${urlPath}monitor-process/intervene/${instanceId}`, {
    method: 'POST',
    body,
    responseType: 'text',
  });
}
