/*
 * @Author: Auto Generated
 * @Date: 2026-07-02
 * @Description: SPR工作台Store
 */

import { DataSet } from 'choerodon-ui/pro';

/**
 * SPR工作台表单DataSet配置
 */
export const filterDS = () => ({
  autoCreate: true,
  fields: [
    {
      name: 'dateStart',
      type: 'date',
      label: '开始日期',
    },
    {
      name: 'dateEnd',
      type: 'date',
      label: '结束日期',
    },
    {
      name: 'prodLine',
      type: 'string',
      label: '生产线',
    },
  ],
});

/**
 * SPR工作台表格DataSet配置
 */
export const tableDS = () => ({
  pageSize: 10,
  queryUrl: '/tarzan/v1/spr/table-data',
  autoQuery: true,
  fields: [
    {
      name: 'time',
      type: 'string',
      label: '时间',
    },
    {
      name: 'line1',
      type: 'number',
      label: '生产线1',
    },
    {
      name: 'line2',
      type: 'number',
      label: '生产线2',
    },
    {
      name: 'line3',
      type: 'number',
      label: '生产线3',
    },
    {
      name: 'line4',
      type: 'number',
      label: '生产线4',
    },
    {
      name: 'line5',
      type: 'number',
      label: '生产线5',
    },
  ],
});
