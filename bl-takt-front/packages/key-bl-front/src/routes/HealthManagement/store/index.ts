/**
 * @Description: 健康管理页面 - DataSet 配置
 * @Author: Assistant
 * @Date: 2026-06-23
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-health';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.healthManagement';

/**
 * 机器人筛选条件 DataSet 配置
 */
export function robotFilterDS(): DataSetProps {
  return {
    autoCreate: true,
    fields: [
      {
        name: 'robotType',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.robotType`).d('机器人类别'),
        lookupCode: 'IIOT.ROBOT_MODEL',
        defaultValue: 'FDS_ROBOT',
      },
    ],
  };
}

/**
 * 机器人类表格 DataSet 配置
 */
export function robotTableDS(): DataSetProps {
  return {
    autoQuery: true,
    autoCreate: false,
    // selection: DataSetSelection.multiple,
    selection: false,
    primaryKey: 'id',
    // queryFields: [
    //   {
    //     name: 'robotType',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.robotType`).d('机器人类别'),
    //     lookupCode: 'IIOT.ROBOT_MODEL_COPY',
    //   },
    // ],
    fields: [
      {
        name: 'id',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.id`).d('ID'),
      },
      {
        name: 'indicatorName',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
        required: true,
      },
      {
        name: 'category',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.category`).d('类别'),
      },
      {
        name: 'weight',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.weight`).d('权重(%)'),
      },
      {
        name: 'formula',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.formula`).d('计算公式/关键参数'),
      },
      {
        name: 'enabled',
        type: FieldType.boolean,
        label: intl.get(`${modelPrompt}.enabled`).d('是否启用'),
      },
      {
        name: '_token',
        type: FieldType.string,
      },
    ],
    data: [
      {
        id: 1,
        indicatorName: '时间稼动率',
        category: '状态类',
        weight: '30%',
        formula: '时间稼动率=实际运行时间/计划生产时间×100%;得分=稼动率%',
        enabled: true,
        _token: 'token1',
      },
      {
        id: 2,
        indicatorName: '重大报警频次',
        category: '状态类',
        weight: '70%',
        formula: '基数10次SERVO级报警,超出扣分',
        enabled: true,
        _token: 'token2',
      },
      {
        id: 3,
        indicatorName: '节拍符合性',
        category: '性能类',
        weight: '40%',
        formula: 'CT偏差率评分',
        enabled: true,
        _token: 'token3',
      },
      {
        id: 4,
        indicatorName: '良品率',
        category: '质量类',
        weight: '100%',
        formula: '合格件数/总产量×100%',
        enabled: true,
        _token: 'token4',
      },
      {
        id: 5,
        indicatorName: '减速机润滑油寿命',
        category: '寿命件类',
        weight: '25%',
        formula: '剩余寿命百分比',
        enabled: true,
        _token: 'token5',
      },
    ],
    transport: {
      read: () => ({
        url: `${apiPrefix}/v1/${organizationId}/robot-indicators`,
        method: 'GET',
      }),
    },
    pageSize: 10,
    paging: 'normal',
  };
}

/**
 * 伺服电机类表格 DataSet 配置
 */
export function servoMotorTableDS(): DataSetProps {
  return {
    autoQuery: true,
    autoCreate: false,
    selection: false,
    primaryKey: 'id',
    // queryFields: [
    //   {
    //     name: 'motorType',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.motorType`).d('电机类型'),
    //   },
    // ],
    fields: [
      {
        name: 'id',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.id`).d('ID'),
      },
      {
        name: 'indicatorName',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
        required: true,
      },
      {
        name: 'category',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.category`).d('类别'),
      },
      {
        name: 'weight',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.weight`).d('权重(%)'),
      },
      {
        name: 'formula',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.formula`).d('计算公式/关键参数'),
      },
      {
        name: 'enabled',
        type: FieldType.boolean,
        label: intl.get(`${modelPrompt}.enabled`).d('是否启用'),
      },
      {
        name: '_token',
        type: FieldType.string,
      },
    ],
    data: [
      {
        id: 1,
        indicatorName: '转矩/推力峰值',
        category: '性能类',
        weight: '50%',
        formula: '峰值率 = 循环峰值 / 额定值 * 100 峰值率≤ 100%, P1=次数 * 0, 100% <峰值率<= 150%, P2=次数*0.2, 150% <峰值率<= 200%, P3=次数*0.6, 峰值率> 200%, P4=次数*1*',
        enabled: true,
        _token: 'token1',
      },
      {
        id: 2,
        indicatorName: '反馈速度峰值',
        category: '性能类',
        weight: '50%',
        formula: '峰值率 = 循环峰值 / 额定值 * 100 峰值率≤ 100%, P1=次数 * 0, 100% <峰值率<= 150%, P2=次数*0.2, 150% <峰值率<= 200%, P3=次数*0.6, 峰值率> 200%, P4=次数*1*',
        enabled: true,
        _token: 'token2',
      },
      {
        id: 3,
        indicatorName: '近期预警频率',
        category: '状态类',
        weight: '100%',
        formula: '评分: 过去24h不到位报警次数 0次满分(100分),1-2次得60分,≥3次得0分。',
        enabled: true,
        _token: 'token3',
      },
      {
        id: 4,
        indicatorName: '寿命',
        category: '寿命件类',
        weight: '100%',
        formula: '通电时间, 线体通电时间',
        enabled: true,
        _token: 'token4',
      },
    ],
    transport: {
      read: () => ({
        url: `${apiPrefix}/v1/${organizationId}/servo-indicators`,
        method: 'GET',
      }),
    },
    pageSize: 10,
    paging: 'normal',
  };
}

/**
 * 夹具气缸类表格 DataSet 配置
 */
export function cylinderTableDS(): DataSetProps {
  return {
    autoQuery: true,
    autoCreate: false,
    selection: false,
    primaryKey: 'id',
    // queryFields: [
    //   {
    //     name: 'cylinderType',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.cylinderType`).d('气缸类型'),
    //   },
    // ],
    fields: [
      {
        name: 'id',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.id`).d('ID'),
      },
      {
        name: 'indicatorName',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
        required: true,
      },
      {
        name: 'category',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.category`).d('类别'),
      },
      {
        name: 'weight',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.weight`).d('权重(%)'),
      },
      {
        name: 'formula',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.formula`).d('计算公式/关键参数'),
      },
      {
        name: 'enabled',
        type: FieldType.boolean,
        label: intl.get(`${modelPrompt}.enabled`).d('是否启用'),
      },
      {
        name: '_token',
        type: FieldType.string,
      },
    ],
    data: [
      {
        id: 1,
        indicatorName: '夹紧周期时长波动性',
        category: '性能类',
        weight: '50%',
        formula: '评分: 波动<5%得100分,5-10%得70分,>10%得0分。波动率=(实际标准差/基准均值)*100%',
        enabled: true,
        _token: 'token1',
      },
      {
        id: 2,
        indicatorName: '松开周期时长波动性',
        category: '性能类',
        weight: '50%',
        formula: '评分: 波动<5%得100分,5-10%得70分,>10%得0分。波动率=(实际标准差/基准均值)*100%',
        enabled: true,
        _token: 'token2',
      },
      {
        id: 3,
        indicatorName: '松开周期时长波动性',
        category: '性能类',
        weight: '50%',
        formula: '评分: 波动<5%得100分,5-10%得70分,>10%得0分。波动率=(实际标准差/基准均值)*100%',
        enabled: true,
        _token: 'token3',
      },
      {
        id: 4,
        indicatorName: '近期报警频率',
        category: '状态类',
        weight: '100%',
        formula: '有气缸超时报警,不多; 评分: 过去24h不到位报警次数 0次满分(100分),1-2次得60分,≥3次得0分。',
        enabled: true,
        _token: 'token4',
      },
      {
        id: 5,
        indicatorName: '剩余寿命比例',
        category: '寿命件类',
        weight: '100%',
        formula: '评分:(剩余寿命百分比)>20%得100分,10%-20%得50分,<10%得0分。UL=累计动作次数/寿命设计动作次数*100%; 剩余寿命比例=100%-UL',
        enabled: true,
        _token: 'token5',
      },
    ],
    transport: {
      read: () => ({
        url: `${apiPrefix}/v1/${organizationId}/cylinder-indicators`,
        method: 'GET',
      }),
    },
    pageSize: 10,
    paging: 'normal',
  };
}
