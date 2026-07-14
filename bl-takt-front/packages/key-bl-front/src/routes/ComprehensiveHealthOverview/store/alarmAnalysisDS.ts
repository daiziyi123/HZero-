/**
 * @Description: 机器人报警分析 - DataSet 配置
 */

import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { AlarmCollectionRecord } from '../services';

export function alarmTableDS(): DataSetProps {
  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    primaryKey: 'id',
    paging: 'server',
    pageSize: 5,
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'alarmStartTime', type: FieldType.string, label: '发生时间' },
      { name: 'alarmCode', type: FieldType.string, label: '报警代码' },
      { name: 'alarmName', type: FieldType.string, label: '报警内容' },
      { name: 'alarmLevel', type: FieldType.string, label: '严重等级' },
    ],
  };
}

export function mapAlarmRecords(list: AlarmCollectionRecord[]) {
  return list.map((item) => ({
    id: String(item.collectId || `${item.alarmStartTime}-${item.alarmCode}`),
    alarmStartTime: item.alarmStartTime,
    alarmCode: item.alarmCode,
    alarmName: item.alarmName,
    alarmLevel: item.alarmLevel,
  }));
}
