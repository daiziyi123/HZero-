/**
 * @Description: 机器人寿命件预警 - DataSet 配置
 */

import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { SparePartWarningItem } from '../services';

export function lifespanWarningTableDS(): DataSetProps {
  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    primaryKey: 'id',
    paging: true,
    pageSize: 10,
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'maintenanceItem', type: FieldType.string, label: '保养项目' },
      { name: 'usedHours', type: FieldType.number, label: '已运行/已服役时长' },
      { name: 'ratedLife', type: FieldType.number, label: '额定寿命' },
      { name: 'remainingLifePercentage', type: FieldType.string, label: '剩余寿命百分比' },
      { name: 'warningThreshold', type: FieldType.string, label: '预警阈值' },
      { name: 'status', type: FieldType.string, label: '状态' },
    ],
  };
}

export function mapSparePartWarningItems(list: SparePartWarningItem[]) {
  return list.map((item, index) => ({
    id: `${item.maintenanceItem}-${index}`,
    maintenanceItem: item.maintenanceItem ?? '',
    usedHours: item.usedHours ?? 0,
    ratedLife: item.ratedLife ?? 0,
    remainingLifePercentage: item.remainingLifePercentage ?? '',
    warningThreshold: item.warningThreshold ?? '',
    status: item.status ?? '',
  }));
}
