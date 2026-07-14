/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { createPagination } from 'utils/utils';
import { getResponse, ergodicData } from '@utils/utils';
import { getUserRole, queryIdpValue } from '@services/api';
import {
  fetchEventTypeList,
  fetchObjectTypeList,
  saveEventType,
  saveObjectType,
  fetchGenTypeList,
} from '../../services/events/eventTypeService';

export default {
  namespace: 'eventTypeLims',
  state: {
    eventTypeList: [], // 事件类型表格数据源
    eventTypePagination: {}, // 事件类型表格分页
    objectTypeList: [], // 对象类型数据源
    objectTypePagination: {}, // 对象类型表格分页
    onhandChangeTypeList: [], // 影响库存方向下拉框数据
    userRole: 'N', // 用户权限
    apiNameList: [], // 事件信息获取API
  },
  effects: {
    // 获取用户权限
    *getUserRole({ payload }, { call, put }) {
      const res = yield call(getUserRole, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            userRole: list.rows,
          },
        });
      }
    },
    // 获取事件类型表数据
    *fetchEventTypeList({ payload }, { call, put }) {
      const res = yield call(fetchEventTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            eventTypeList: chainget(list, 'rows.content', []),
            eventTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取事件信息获取API数据
    *fetchApiNameList({ payload }, { call, put }) {
      const res = yield call(queryIdpValue, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            apiNameList: list,
          },
        });
      }
    },

    // 获取对象类型数据
    *fetchObjectTypeList({ payload }, { call, put }) {
      const res = yield call(fetchObjectTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            objectTypeList: chainget(list, 'rows.content', []),
            objectTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取影响库存方向下拉框数据
    *fetchOnhandChangeTypeList({ payload }, { call, put }) {
      const res = yield call(fetchGenTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            onhandChangeTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存事件类型
    *saveEventType({ payload }, { call }) {
      const result = yield call(saveEventType, ergodicData(payload));
      return getResponse(result);
    },

    // 保存对象类型
    *saveObjectType({ payload }, { call }) {
      const result = yield call(saveObjectType, ergodicData(payload));
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
