/**
 * @Description: 学习示例页面 - DataSet 配置
 * @Author: Assistant
 * @Date: 2026-06-10
 * 
 * 本文件定义：
 * 1. 表格的 DataSet 配置（tableDS）
 * 2. 弹框的 DataSet 配置（modalDS）
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.learningDemo';

/**
 * 表格 DataSet 配置
 * 用于管理表格数据和查询条件
 */
export function tableDS(): DataSetProps {
  return {
    // 是否自动查询（组件挂载后自动调用 query 方法）
    autoQuery: true,
    // 是否自动创建记录（通常设为 false）
    autoCreate: false,
    // 选择模式：multiple | single | null
    selection: DataSetSelection.multiple,
    // 主键字段名
    primaryKey: 'demoId',
    // 查询字段配置（显示在查询栏）
    // queryFields: [
    //   {
    //     name: 'demoCode',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoCode`).d('编码'),
    //     // 模糊查询
    //     fuzzy: true,
    //   },
    //   {
    //     name: 'demoName',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoName`).d('名称'),
    //     fuzzy: true,
    //   },
    //   {
    //     name: 'demoType',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoType`).d('类型'),
    //     // 使用 lookupCode 下拉选择
    //     lookupCode: 'DEMO.TYPE',
    //   },
    //   {
    //     name: 'demoDateRange',
    //     type: FieldType.date,
    //     label: intl.get(`${modelPrompt}.demoDate`).d('日期范围'),
    //     // 设置为日期范围选择器
    //     range: true,
    //     // 添加日期格式配置
    //     dateFormat: 'yyyy-MM-dd',
    //   },
    //   // 新增查询字段
    //   {
    //     name: 'demoStatus',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoStatus`).d('状态'),
    //     lookupCode: 'DEMO.STATUS',
    //   },
    //   {
    //     name: 'demoAmount',
    //     type: FieldType.number,
    //     label: intl.get(`${modelPrompt}.demoAmount`).d('金额'),
    //   },
    //   {
    //     name: 'demoFlag',
    //     type: FieldType.boolean,
    //     label: intl.get(`${modelPrompt}.demoFlag`).d('标志'),
    //   },
    //   {
    //     name: 'demoUser',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoUser`).d('创建人'),
    //     fuzzy: true,
    //   },
    //   {
    //     name: 'demoDept',
    //     type: FieldType.string,
    //     label: intl.get(`${modelPrompt}.demoDept`).d('部门'),
    //     fuzzy: true,
    //   },
    // ],
    // 字段配置（表格列和表单字段）
    fields: [
      {
        name: 'demoId',
        type: FieldType.string,
        // 主键通常不显示不编辑
        required: false,
      },
      {
        name: 'demoCode',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoCode`).d('编码'),
        // 必填
        required: true,
        // 正则验证
        regex: /^[A-Z0-9]+$/,
        // 验证失败提示
        validator: ({ value }) => {
          if (!value || /^[A-Z0-9]+$/.test(value)) {
            return true;
          }
          return '编码只能包含大写字母和数字';
        },
      },
      {
        name: 'demoName',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoName`).d('名称'),
        required: true,
        // 长度限制
        maxLength: 50,
      },
      {
        name: 'demoType',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoType`).d('类型'),
        required: true,
        // 下拉选择值集
        lookupCode: 'DEMO.TYPE',
      },
      {
        name: 'demoDate',
        type: FieldType.date,
        label: intl.get(`${modelPrompt}.demoDate`).d('日期'),
        required: false,
        // 日期格式
        dateFormat: 'yyyy-MM-dd',
      },
      {
        name: 'remark',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.remark`).d('备注'),
        required: false,
        maxLength: 500,
      },
      // 新增表格字段
      {
        name: 'demoStatus',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoStatus`).d('状态'),
        required: false,
        lookupCode: 'DEMO.STATUS',
      },
      {
        name: 'demoAmount',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.demoAmount`).d('金额'),
        required: false,
        step: 0.01,
      },
      {
        name: 'demoFlag',
        type: FieldType.boolean,
        label: intl.get(`${modelPrompt}.demoFlag`).d('标志'),
        required: false,
      },
      {
        name: 'demoUser',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoUser`).d('创建人'),
        required: false,
        maxLength: 50,
      },
      {
        name: 'demoDept',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoDept`).d('部门'),
        required: false,
        maxLength: 100,
      },
    ],
    // 查询接口配置
    url: `${apiPrefix}/v1/${organizationId}/demo-data/query`,
    // 每页显示条数
    pageSize: 20,
    // 分页方式：normal | infinite | none
    paging: 'normal',
    // 本地测试数据
    data: generateMockData(10),
  };
}

/**
 * 生成假数据（20条）
 */
function generateMockData(count: number) {
  const types = ['TYPE1', 'TYPE2', 'TYPE3'];
  const statuses = ['ACTIVE', 'INACTIVE', 'PENDING'];
  const users = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const depts = ['研发部', '市场部', '销售部', '人事部', '财务部', '生产部', '质量部', '采购部'];
  const data: any[] = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      demoId: `DEMO${String(i).padStart(4, '0')}`,
      demoCode: `CODE${String(i).padStart(4, '0')}`,
      demoName: `示例名称${i}`,
      demoType: types[i % 3],
      demoDate: `2026-06-${String((i % 30) + 1).padStart(2, '0')}`,
      remark: `这是第 ${i} 条示例数据的备注信息`,
      demoStatus: statuses[i % 3],
      demoAmount: Math.round(Math.random() * 100000) / 100,
      demoFlag: i % 2 === 0,
      demoUser: users[i % 8],
      demoDept: depts[i % 8],
    });
  }

  return data;
}

/**
 * 弹框 DataSet 配置
 * 用于管理弹框中的表单数据
 */
export function modalDS(): DataSetProps {
  return {
    autoCreate: false,
    fields: [
      {
        name: 'demoCode',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoCode`).d('编码'),
        required: true,
        regex: /^[A-Z0-9]+$/,
      },
      {
        name: 'demoName',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoName`).d('名称'),
        required: true,
        maxLength: 50,
      },
      {
        name: 'demoType',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoType`).d('类型'),
        required: true,
        lookupCode: 'DEMO.TYPE',
      },
      {
        name: 'demoDate',
        type: FieldType.date,
        label: intl.get(`${modelPrompt}.demoDate`).d('日期'),
        required: false,
        dateFormat: 'yyyy-MM-dd',
      },
      {
        name: 'remark',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.remark`).d('备注'),
        required: false,
        maxLength: 500,
      },
      // 新增弹框字段
      {
        name: 'demoStatus',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoStatus`).d('状态'),
        required: false,
        lookupCode: 'DEMO.STATUS',
      },
      {
        name: 'demoAmount',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.demoAmount`).d('金额'),
        required: false,
        step: 0.01,
      },
      {
        name: 'demoFlag',
        type: FieldType.boolean,
        label: intl.get(`${modelPrompt}.demoFlag`).d('标志'),
        required: false,
      },
      {
        name: 'demoUser',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoUser`).d('创建人'),
        required: false,
        maxLength: 50,
      },
      {
        name: 'demoDept',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.demoDept`).d('部门'),
        required: false,
        maxLength: 100,
      },
    ],
  };
}
