import React, { useMemo, useEffect, useRef } from 'react';
import { Table, DataSet, TextField, Icon } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { withRouter } from 'react-router-dom';
import formatterCollections from 'utils/intl/formatterCollections';
import { ColumnProps, ColumnLock } from 'choerodon-ui/pro/lib/table/interface';
import notification from 'utils/notification';
import { useRequest } from '@components/tarzan-hooks';
import styles from './styles/index.modules.less';
import { controlDS, needLoadDataTableDS } from './stores';
import { FetchBarcodeScan } from './services';

const modelPrompt = 'tarzan.qms.inspectionPlatform';

const ScanModal = props => {
  const { history, modalCallback } = props;
  const InputRef = useRef();

  useEffect(() => {
    if (InputRef?.current) {
      InputRef.current.focus();
    }
  }, []);

  // 检验条码明细
  const controlDs = useMemo(() => new DataSet(controlDS()), []);
  const needLoadDataTableDs = useMemo(() => new DataSet(needLoadDataTableDS()), []);

  const barcodeScanRequest = useRequest(FetchBarcodeScan(), {
    manual: true,
    needPromise: true,
  });

  // 扫码列表
  const scanTableColumns: ColumnProps[] = [
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
    modalCallback();
    history.push(`/hwms/inspection-platform-performance/dist/${inspectTaskId}`);
  };

  const barcodeScan = async () => {
    const barcode = controlDs.current?.get('barcode');
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
      if (res.rows?.length === 1) {
        goDetail(res.rows[0].inspectTaskId);
      }
    }
  };

  return (
    <div>
      <div className={styles['scan-input-box']}>
        <div
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#4c7cf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon type="crop_free" style={{
            color: '#fff',
            fontSize: '30px',
          }} />
        </div>
        <TextField
          ref={InputRef}
          style={{
            marginLeft: '8px',
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
        border={false}
        dataSet={needLoadDataTableDs}
        columns={scanTableColumns}
        style={{
          height: '200px',
        }}
      />
    </div>
  );
};

export default formatterCollections({
  code: ['tarzan.qms.inspectionPlatform', 'tarzan.common'],
})(withRouter(ScanModal));
