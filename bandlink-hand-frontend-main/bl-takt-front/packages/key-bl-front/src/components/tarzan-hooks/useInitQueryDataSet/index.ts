/**
 * @Description: 根据Url传参修改查询表单并重查
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @Date: 2021-09-26 13:14:02
 * @LastEditTime: 2021-10-12 16:55:16
 * @LastEditors: <ruiqi.jiang01@hand-china.com>
 */
import { useEffect } from 'react';
import { DataSet } from 'choerodon-ui/pro/lib';
import { getQueryParam } from '@/utils/utils';

/**
 * 根据Url传参修改查询表单并重查
 * @param {DataSet} dataSet 列表页表格dataSet
 */
const useInitQueryDataSet = (dataSet: DataSet): void => {
  useEffect(() => {
    const queryParams = getQueryParam();
    if (queryParams && typeof queryParams === 'object') {
      dataSet.queryDataSet!.loadData([queryParams]);
      dataSet.query();
    } else {
      dataSet.queryDataSet!.loadData([{}]);
    }
  }, [window.location.search]);
};

export default useInitQueryDataSet;
