import request from 'utils/request';
import { getResponse } from 'utils/utils';
import { isEqual, isUndefined } from 'lodash';
import { getUrlPath, HZERO_HWKF, HZERO_HWFF } from 'hzero-front-hwkf/lib/utils';

const urlPath = getUrlPath();

export function getFlagService(query, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-configs/getConfig`, {
    method: 'GET',
    query,
  }).then((res) => {
    if (!isUndefined(getResponse(res))) {
      if (isEqual(res, {})) {
        return cb(false);
      } else {
        return cb(res);
      }
    }
  });
}

export function getExtendFieldService(query, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-extend-fields/list-global`, {
    method: 'GET',
    query,
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export function submitExtendFieldService(body, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-extend-fields/save-global`, {
    method: 'POST',
    body,
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export function disableExtendFieldService(fieldId, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-extend-fields/disable/${fieldId}`, {
    method: 'POST',
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export function enableExtendFieldService(fieldId, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-extend-fields/enable/${fieldId}`, {
    method: 'POST',
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export function syncWorkflowFieldService(_, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}predefine-data/sync/extend-field`, {
    method: 'POST',
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export function getFieldService(pageType, cb) {
  return request(`${HZERO_HWKF}/v1/${urlPath}def-extend-fields/list-by-page`, {
    method: 'GET',
    query: { pageType },
  }).then((res) => {
    if (getResponse(res)) {
      return cb(res);
    }
  });
}

export async function getFormByIdService(formId, cb) {
  const res = await request(`${HZERO_HWFF}/v1/${urlPath}def-work-forms/${formId}`, {
    method: 'GET',
  });
  if (getResponse(res)) {
    cb?.(res);
  }
}
