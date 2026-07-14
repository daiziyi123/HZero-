import React, { useEffect, useMemo } from 'react';
import { Table, DataSet, Switch, TextField, Icon } from 'choerodon-ui/pro';
import { Card } from 'choerodon-ui';
import intl from 'utils/intl';
import { withRouter } from 'react-router-dom';
import formatterCollections from 'utils/intl/formatterCollections';
import { ColumnProps, ColumnLock, TableAutoHeightType } from 'choerodon-ui/pro/lib/table/interface';
import notification from 'utils/notification';
import { useRequest } from '@components/tarzan-hooks';
import styles from './styles/index.modules.less';
import { controlDS, needLoadDataTableDS } from './stores';
import { FetchBarcodeScan } from './services';

const modelPrompt = 'tarzan.qms.inspectionPlatform';

const InspectionPlatformList = props => {
  const { history } = props;

  // 检验条码明细
  const controlDs = useMemo(() => new DataSet(controlDS()), []);
  const needLoadDataTableDs = useMemo(() => new DataSet(needLoadDataTableDS()), []);

  const barcodeScanRequest = useRequest(FetchBarcodeScan(), {
    manual: true,
    needPromise: true,
  });

  useEffect(() => {
    controlDs.loadData([
      {
        scanEnter: 'Y',
      },
    ]);
  }, []);

  // 扫码列表
  const scanTableColumns: ColumnProps[] = [
    {
      name: 'sequence',
      lock: ColumnLock.left,
    },
    {
      name: 'inspectTaskCode',
      width: 160,
      lock: ColumnLock.left,
      renderer: ({ value, record }) => {
        // 跳转详情
        return (
          <a
            onClick={() => {
              goDetail(record?.get('inspectTaskId'));
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      name: 'inspectBusinessType',
    },
    {
      name: 'materialCode',
    },
    {
      name: 'materialDesc',
    },
    {
      name: 'inspectTaskStatus',
    },
    {
      name: 'inspectInfoCreationDate',
    },
  ];

  const goDetail = inspectTaskId => {
    history.push(`/hwms/inspection-platform-performance/dist/${inspectTaskId}`);
  };

  const barcodeScan = async () => {
    const barcode = controlDs.current?.get('barcode');
    const scanEnter = controlDs.current?.get('scanEnter');
    if (!barcode) {
      return;
    }
    const res = await barcodeScanRequest.run({
      params: {
        barcode,
      },
    });

    if (res.success) {
      needLoadDataTableDs.loadData(res.rows);
      if (res.rows?.length === 0) {
        notification.warning({
          message: intl.get(`${modelPrompt}.barcodeScanRequestEmpty`).d('未找到相关检验任务'),
        });
      }
      if (res.rows?.length === 1 && scanEnter === 'Y') {
        goDetail(res.rows[0].inspectTaskId);
      }
    }
  };

  return (
    <Card
      className={styles['card-box']}
      title={intl.get(`${modelPrompt}.scanBarCodeTip`).d('扫描实物条码进入检验任务')}
      bordered={false}
      style={{ width: '100%', height: '100%' }}
      extra={<Switch dataSet={controlDs} name="scanEnter" />}
    >
      <div className={styles['scan-input-box']}>
        <TextField
          prefix={<Icon type="volume_mute" />}
          style={{
            width: '100%',
          }}
          dataSet={controlDs}
          name="barcode"
          onEnterDown={barcodeScan}
        />
      </div>
      <div className={styles['scan-table-tip']}>
        <Icon
          type="report_problem-o"
          style={{
            color: 'orange',
          }}
        />
        通过当前实物标签找到了多个有权限的待检任务, 请确定需要进入的待检任务!
      </div>
      <Table
        autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 12 }}
        border={false}
        dataSet={needLoadDataTableDs}
        columns={scanTableColumns}
        style={{
          height: '200px',
        }}
      />
    </Card>
  );
};

export default formatterCollections({
  code: ['tarzan.qms.inspectionPlatform', 'tarzan.common'],
})(withRouter(InspectionPlatformList));
