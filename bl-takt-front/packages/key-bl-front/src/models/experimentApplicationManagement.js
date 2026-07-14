/**
 * @Description: 实验申请管理
 * @Author: <liyuan01.liu@hand-china.com>
 * @Date: 2022-08-02
 * @LastEditTime: 2022-08-08
 * @LastEditors: <liyuan01.liu@hand-china.com>
 */
import { getResponse } from '@utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  getUsersMsg,
  submitForApprovalApi,
  similarToCreateApi,
  downloadTestReportApi,
  withdrawApprovalApi,
  deleteApplicationFormApi,
  goToDetailsByRequisitionApi,
  getDynamicDisplayFieldsApi,
  saveApplicationApi,
  approvalFlowDetailsApi,
  saveApprovalFlowApi,
  getDynamicApprovalFlowApi,
  getMenuInfo,
  getReportLov,
  getReviewerLov,
  getMangers,
  getPostscriptList,
  savePostscript,
  discontinueTask,
} from '../services/experimentApplicationManagementService';

export default {
  namespace: 'experimentApplicationManagement',
  state: {
    menuInfo: [],
    sampleStructureInfo: [], // 样品结构-新建
    samplePrintingInfo: [], // 样品印刷-编辑
    sampleStructureInfoEdit: [], // 样品结构-编辑
    samplePrintingInfoEdit: [], // 样品结构-编辑
  },
  effects: {
    // 类似创建
    *getMenuInfo({ payload }, { call, put }) {
      const result = yield call(getMenuInfo, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            menuInfo: list,
          },
        });
      }
      return list;
    },
    // 提交审批
    *submitForApprovalApi({ payload }, { call }) {
      const result = yield call(submitForApprovalApi, payload);
      return getResponse(result);
    },
    // 类似创建
    *similarToCreateApi({ payload }, { call, put }) {
      const result = yield call(similarToCreateApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sampleStructureInfoEdit: list.structures,
            samplePrintingInfoEdit: list.prints,
          },
        });
      }
      return list;
    },
    // 下载检测报告
    *downloadTestReportApi({ payload }, { call }) {
      const result = yield call(downloadTestReportApi, payload);
      return getResponse(result);
    },
    // 撤回审批
    *withdrawApprovalApi({ payload }, { call }) {
      const result = yield call(withdrawApprovalApi, payload);
      return getResponse(result);
    },
    // 删除申请单
    *deleteApplicationFormApi({ payload }, { call }) {
      const result = yield call(deleteApplicationFormApi, payload);
      return getResponse(result);
    },
    // 实验申请表明细
    *goToDetailsByRequisitionApi({ payload }, { call, put }) {
      const result = yield call(goToDetailsByRequisitionApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sampleStructureInfoEdit: list.structures,
            samplePrintingInfoEdit: list.prints,
          },
        });
      }
      return list;
    },
    // 获取动态样品结构
    *sampleStructureInfoApi({ payload }, { call, put }) {
      const result = yield call(getDynamicDisplayFieldsApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sampleStructureInfo: list,
          },
        });
      }
      return list;
    },
    // 获取动态样品印刷
    *samplePrintingInfoApi({ payload }, { call, put }) {
      const result = yield call(getDynamicDisplayFieldsApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            samplePrintingInfo: list,
          },
        });
      }
      return list;
    },
    // 保存申请单
    *saveApplicationApi({ payload }, { call }) {
      const result = yield call(saveApplicationApi, payload);
      return getResponse(result);
    },
    // 实验申请表明细-审批流
    *approvalFlowDetailsApi({ payload }, { call, put }) {
      const result = yield call(approvalFlowDetailsApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sampleStructureInfoEdit: list.structures,
            samplePrintingInfoEdit: list.prints,
          },
        });
      }
      return list;
    },
    // 获取动态样品结构-审批流
    *sampleStructureApprovalApi({ payload }, { call, put }) {
      const result = yield call(getDynamicApprovalFlowApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sampleStructureInfo: list,
          },
        });
      }
      return list;
    },
    // 获取动态样品印刷-审批流
    *samplePrintingApprovalApi({ payload }, { call, put }) {
      const result = yield call(getDynamicApprovalFlowApi, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            samplePrintingInfo: list,
          },
        });
      }
      return list;
    },
    // 保存-审批流
    *saveApprovalFlowApi({ payload }, { call }) {
      const result = yield call(saveApprovalFlowApi, payload);
      return getResponse(result);
    },
    // 页面关闭时清空model
    *cleanModel(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          sampleStructureInfo: [], // 样品结构-新建
          samplePrintingInfo: [], // 样品印刷-编辑
          sampleStructureInfoEdit: [], // 样品结构-编辑
          samplePrintingInfoEdit: [], // 样品结构-编辑
        },
      });
    },
    // 查询实验报告模板值集
    *getReportLov({ payload }, { call }) {
      const result = yield call(getReportLov, payload);
      return getResponse(result);
    },
    // 查询实验报告模板值集
    *getReviewerLov({ payload }, { call }) {
      const result = yield call(getReviewerLov, payload);
      return getResponse(result);
    },
    *getManagers({ payload }, { call }) {
      const result = yield call(getMangers, payload);
      return getResponse(result);
    },
    // 查询默认样品管理员、批准人值集
    *getDefaultPersonList({ payload }, { call }) {
      const result = getResponse(yield call(queryMapIdpValue, payload));
      return result;
    },
    // 根据员工编号获取员工信息
    *getUsersMsg({ payload }, { call }) {
      const { headOfLaboratoryNum, sampleReviewerNum } = payload;
      const result = getResponse(yield call(getUsersMsg, `${headOfLaboratoryNum},${sampleReviewerNum}`));
      const headOfLaboratory = headOfLaboratoryNum && result.find((item) => item.employeeNum === headOfLaboratoryNum);
      const sampleReviewer =
        sampleReviewerNum && result.find((item) => item.employeeNum === sampleReviewerNum);
      return {
        headOfLaboratory: {
          name: headOfLaboratory.employeeName,
          userId: headOfLaboratory.userId,
        },
        sampleReviewer: {
          name: sampleReviewer.employeeName,
          userId: sampleReviewer.userId,
        },
      };
    },
    // 根据试验申请单id查询附言列表
    *getPostscriptList({ payload }, { call }) {
      const result = yield call(getPostscriptList, payload);
      return getResponse(result);
    },
    // 根据保存附言信息
    *savePostscript({ payload }, { call }) {
      const result = yield call(savePostscript, payload);
      return getResponse(result);
    },
    // 终止任务
    *discontinueTask({ payload }, { call }) {
      const result = yield call(discontinueTask, payload);
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
