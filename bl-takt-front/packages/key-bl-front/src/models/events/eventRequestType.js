/**
 * @date 2019-8-1
 * @author HDY <deying.huang@hand-china.com>
 */

import { createPagination } from 'utils/utils';
import { getResponse, ergodicData } from '@utils/utils';

import {
  fetchEventRequestTypeList,
  saveEventRequestType,
} from '../../services/events/eventRequestTypeService';

export default {
  namespace: 'eventRequestTypeLims',
  state: {
    eventRequestTypeList: [], // 事件请求类型表格数据源
    eventRequestTypePagination: {}, // 事件请求类型表格分页
  },
  effects: {
    // 获取事件请求类型表数据
    *fetchEventRequestTypeList({ payload }, { call, put }) {
      const res = yield call(fetchEventRequestTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            eventRequestTypeList: list.rows.content,
            eventRequestTypePagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存事件请求类型
    *saveEventRequestType({ payload }, { call }) {
      const result = yield call(saveEventRequestType, ergodicData(payload));
      return getResponse(result);
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
