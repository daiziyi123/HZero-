import { getResponse } from '@utils/utils';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import {
  doQueryTaskRecordGroups,
  doQueryTaskRecordItems,
  doChangeTemplate,
  doQuerySampleList,
  doSaveGroup,
  doQueryCheckOrigin,
  doSaveCheckOrigin,
  doManualAdd,
  doUpdateExperimentStatus,
  doSubmit,
  doSendBack,
  doQueryDefaultTemplate,
  doCreateReport,
  doUpdateExperimentTask,
  doBatchUpdateExperimentTask,
  doUploadCompress,
  doDeleteCompress,
} from '../services/detectRawDataQuery';

export default {
  namespace: 'detectRawDataQuery',
  state: {
    code: {}, // 存储独立值集信息

    /**
     * 第一层本身，代表检测项目（唯一标识是taskItemId），不可新增
     * 第二层groups，代表实验环境（唯一标识是groupId），可新增，动态列，列信息存放在其下的objs数组中
     * 第三层recordItems，代表实验记录项目（唯一标识是recordItemId），可新增
     * 第四层details，代表实验记录项-测试结果原始记录，可新增
     */
    taskItemList: [], // 存储检测项目数据（全部的数据）

    parentGroupData: [], // 若请求的实验环境数据有父的组，将数据存储起来 每一项为 { taskItemId、groupData }

    currentTaskItemId: undefined, // 当前的taskItemId，检测项目层
    currentGroupId: undefined, // 当前的groupId，实验环境层
    currentRecordItemId: undefined, // 当前的recordItemId，实验记录项目层
  },
  effects: {
    // 更新state中某个属性的值
    *updateStateValue({ payload }, { put }) {
      const { name, value } = payload;
      yield put({
        type: 'updateState',
        payload: {
          [name]: value,
        },
      });
    },

    // 更新实验环境数据（第二层）
    *updateGroups({ payload }, { select, put }) {
      const { taskItemId, groups } = payload;
      const taskItemList = yield select(({ detectRawDataQuery }) => {
        return detectRawDataQuery.taskItemList;
      });
      const index = taskItemList.findIndex((ele) => ele.taskItemId === taskItemId);
      if (index !== -1) {
        taskItemList[index].groups = groups;
      }
      yield put({
        type: 'updateState',
        payload: {
          taskItemList,
        },
      });
    },

    // 更新parentGroupData
    *updateParentGroupData({ payload }, { select, put }) {
      const { taskItemId, groupData } = payload;
      const parentGroupData = yield select(({ detectRawDataQuery }) => {
        return detectRawDataQuery.parentGroupData;
      });
      const index = parentGroupData.findIndex((ele) => ele.taskItemId === taskItemId);
      if (index === -1) {
        parentGroupData.push({ taskItemId, groupData });
      } else {
        parentGroupData[index].groupData = groupData;
      }
      yield put({
        type: 'updateState',
        payload: {
          parentGroupData,
        },
      });
    },

    // 清除当前检测项目下的缓存数据
    *clearCurrentTaskItem({ payload }, { select, put }) {
      const { taskItemId } = payload;
      const taskItemList = yield select(({ detectRawDataQuery }) => {
        return detectRawDataQuery.taskItemList;
      });
      const parentGroupData = yield select(({ detectRawDataQuery }) => {
        return detectRawDataQuery.parentGroupData;
      });
      const index = taskItemList.findIndex((ele) => ele.taskItemId === taskItemId);
      if (index !== -1) {
        taskItemList[index].groups = [];
        if (parentGroupData[index] && parentGroupData[index].taskItemId === taskItemId) {
          parentGroupData.splice(index, 1);
        }
        yield put({
          type: 'updateState',
          payload: {
            taskItemList,
            parentGroupData,
            currentTaskItemId: undefined,
            currentGroupId: undefined,
            currentRecordItemId: undefined,
          },
        });
      }
    },

    // 清空录入页数据
    *resetSetData(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          taskItemList: [],
          parentGroupData: [],
          currentTaskItemId: undefined,
          currentGroupId: undefined,
          currentRecordItemId: undefined,
        },
      });
    },

    // 获得独立值集的数据
    *batchCode({ payload }, { call, put }) {
      const response = yield call(queryMapIdpValue, payload);
      const list = getResponse(response);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            code: list,
          },
        });
        return list;
      }
    },

    // 获得独立值集的数据
    *batchCodeNotSave({ payload }, { call }) {
      const response = yield call(queryMapIdpValue, payload);
      const list = getResponse(response);
      return list;
    },
    // 查询实验环境（第二层）
    *doQueryTaskRecordGroups({ payload }, { call }) {
      const response = yield call(doQueryTaskRecordGroups, payload);
      return getResponse(response);
    },
    // 查询实验记录项（第三层）
    *doQueryTaskRecordItems({ payload }, { call }) {
      const response = yield call(doQueryTaskRecordItems, payload);
      return getResponse(response);
    },
    // 更新检查项目（更换模板）
    *doChangeTemplate({ payload }, { call }) {
      const response = yield call(doChangeTemplate, payload);
      return getResponse(response);
    },
    // 查询样品编码
    *doQuerySampleList({ payload }, { call }) {
      const response = yield call(doQuerySampleList, payload);
      return getResponse(response);
    },
    // 保存实验环境
    *doSaveGroup({ payload }, { call }) {
      const response = yield call(doSaveGroup, payload);
      return getResponse(response);
    },
    // 查询实验记录项目-检测原始记录数据
    *doQueryCheckOrigin({ payload }, { call }) {
      const response = yield call(doQueryCheckOrigin, payload);
      return getResponse(response);
    },
    // 保存实验记录项目-检测原始记录数据
    *doSaveCheckOrigin({ payload }, { call }) {
      const response = yield call(doSaveCheckOrigin, payload);
      return getResponse(response);
    },
    // 手动新增实验记录项
    *doManualAdd({ payload }, { call }) {
      const response = yield call(doManualAdd, payload);
      return getResponse(response);
    },
    // 更新实验任务状态
    *doUpdateExperimentStatus({ payload }, { call }) {
      const response = yield call(doUpdateExperimentStatus, payload);
      return getResponse(response);
    },
    // 提交审批
    *doSubmit({ payload }, { call }) {
      const response = yield call(doSubmit, payload);
      return getResponse(response);
    },
    // 提交退回
    *doSendBack({ payload }, { call }) {
      const response = yield call(doSendBack, payload);
      return getResponse(response);
    },
    // 提交审批
    *doQueryDefaultTemplate({ payload }, { call }) {
      const response = yield call(doQueryDefaultTemplate, payload);
      return getResponse(response);
    },
    // 生成报告
    *doCreateReport({ payload }, { call }) {
      const response = yield call(doCreateReport, payload);
      return getResponse(response);
    },
    // 更新实验任务
    *doUpdateExperimentTask({ payload }, { call }) {
      const response = yield call(doUpdateExperimentTask, payload);
      return getResponse(response);
    },
    // 批量更新实验任务
    *doBatchUpdateExperimentTask({ payload }, { call }) {
      const response = yield call(doBatchUpdateExperimentTask, payload);
      return getResponse(response);
    },
    // 上传文件（缩略图）
    *doUploadCompress({ payload }, { call }) {
      const response = yield call(doUploadCompress, payload);
      return getResponse(response);
    },
    // 删除文件（缩略图）
    *doDeleteCompress({ payload }, { call }) {
      const response = yield call(doDeleteCompress, payload);
      return getResponse(response);
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
