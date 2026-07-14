import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { Card } from 'choerodon-ui';
import { withRouter } from 'react-router-dom';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  ColumnProps,
  ColumnAlign,
  ColumnLock,
  TableAutoHeightType,
} from 'choerodon-ui/pro/lib/table/interface';
import { useDataSetEvent } from 'utils/hooks';
import styles from './styles/index.modules.less';
import { TableDS, QueryDS } from './stores';

const modelPrompt = 'tarzan.qms.inspectionPlatform';

const InspectionPlatformList = props => {
  const { history } = props;

  const queryDs = useMemo(() => {
    return new DataSet(QueryDS());
  }, []);

  const pendingTableDs = useMemo(() => {
    return new DataSet({ ...TableDS(), queryDataSet: queryDs });
  }, []);
  const approvealTableDs = useMemo(() => {
    return new DataSet({ ...TableDS(), queryDataSet: queryDs });
  }, []);

  const [pendingCount, setPendingTabCount] = useState(0);
  const [approvealCount, setApprovealTabCount] = useState(0);

  const handlePendingTableDsLoad = ({ dataSet }) => {
    setPendingTabCount(dataSet.totalCount || 0);
  };
  const handleApprovealTableDsLoad = ({ dataSet }) => {
    setApprovealTabCount(dataSet.totalCount || 0);
  };

  useDataSetEvent(pendingTableDs, 'load', handlePendingTableDsLoad);
  useDataSetEvent(approvealTableDs, 'load', handleApprovealTableDsLoad);

  const [activeType, setActiveType] = useState('PENDING');

  useEffect(() => {
    pendingTableDs.setQueryParameter('tableKey', 'PENDING');
    pendingTableDs.query();
    approvealTableDs.setQueryParameter('tableKey', 'APPROVEAL');
    approvealTableDs.query();
  }, []);

  const handleaAtiveTypeChange = value => {
    setActiveType(value);
  };

  const queryOther = () => {
    if (activeType === 'PENDING') {
      approvealTableDs.query();
    } else {
      pendingTableDs.query();
    }
  };

  // 报检任务
  const columns: ColumnProps[] = [
    {
      name: 'inspectBusinessTypeDesc',
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
      name: 'inspectInfoCreationDate',
      align: ColumnAlign.center,
      width: 150,
      renderer: ({ value }) => (value ? moment(value).format('YYMMDD HH:mm') : value),
    },
    // {
    //   name: 'urgentFlag',
    //   align: ColumnAlign.center,
    //   width: 120,
    //   renderer: ({ value }) => (
    //     <Badge
    //       status={value === 'Y' ? 'success' : 'error'}
    //       text={
    //         value === 'Y'
    //           ? intl.get(`tarzan.common.label.yes`).d('是')
    //           : intl.get(`tarzan.common.label.no`).d('否')
    //       }
    //     />
    //   ),
    // },
    {
      name: 'materialCode',
    },
    {
      name: 'materialName',
    },
    {
      name: 'inspectSumQty',
    },
    {
      name: 'woNumber',
    },
    {
      name: 'supplierName',
    },
    {
      name: 'locatorName',
    },
    {
      name: 'areaName',
    },
    {
      name: 'prodLineName',
      renderer: ({ value, record }) => {
        // 跳转详情
        return (
          <div className={styles['urgentFlag-box']}>
            <div>{value}</div>
            {record?.get('urgentFlag') === 'Y' && (
              <div className={styles['urgentFlag-box-icon']}>加急</div>
            )}
          </div>
        );
      },
    },
  ];

  const goDetail = inspectTaskId => {
    history.push(`/hwms/inspection-platform-performance/dist/${inspectTaskId}`);
  };

  const goList = () => {
    history.push({
      pathname: `hwms/inspection-platform-performance/list/`,
      state: {
        searchData: {},
        needClear: true,
      },
    });
  };

  return (
    <Card
      className={styles['card-box']}
      title={
        <>
          <div
            onClick={() => {
              handleaAtiveTypeChange('PENDING');
            }}
            className={styles['type-item']}
          >
            <span
              className={activeType === 'PENDING' ? styles['active-type'] : styles['normal-type']}
            >
              {intl.get(`${modelPrompt}.tab.pendingTask`).d('待处理检验任务')}
            </span>
            <span className={styles['type-num']}>{pendingCount || 0}</span>
          </div>
          <div
            onClick={() => {
              handleaAtiveTypeChange('APPROVEAL');
            }}
            className={styles['type-item']}
          >
            <span
              className={activeType === 'APPROVEAL' ? styles['active-type'] : styles['normal-type']}
            >
              {intl.get(`${modelPrompt}.tab.APPROVEAL`).d('待审核检验任务')}
            </span>
            <span className={styles['type-num']}>{approvealCount || 0}</span>
          </div>
        </>
      }
      bordered={false}
      style={{ width: '100%', height: '100%' }}
      extra={
        <Button funcType={FuncType.link} onClick={goList}>
          更多
        </Button>
      }
    >
      <Table
        autoHeight={{ type: TableAutoHeightType.maxHeight, diff: 52 }}
        dataSet={activeType === 'PENDING' ? pendingTableDs : approvealTableDs}
        columns={columns}
        queryBarProps={{
          onReset: queryOther,
          onQuery: queryOther,
        }}
      />
    </Card>
  );
};

export default formatterCollections({
  code: ['tarzan.qms.inspectionPlatform', 'tarzan.common'],
})(withRouter(InspectionPlatformList));
