/**
 * @Description:
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-02-28 11:44:46
 * @LastEditTime: 2023-04-11 10:31:12
 * @LastEditors: <yang.ni01@hand-china.com>
 */

import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { DataSet, Table } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { Popover, Radio } from 'choerodon-ui';
import intl from 'utils/intl';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { useRequest } from '@components/tarzan-hooks';
import { SetUserDefaultOrganization } from './services';
import styles from './index.module.less';

const modelPrompt = 'tarzan.model.hmes.userRights';

interface OrganizationTableProps {
  ds: DataSet;
  siteListDs: DataSet;
  maxHeight: number;
}

const OrganizationTable = observer((props: OrganizationTableProps) => {
  const { siteListDs, maxHeight } = props;

  const setUserDefaultOrganization = useRequest(SetUserDefaultOrganization(), { manual: true });

  const labelMap = useMemo(() => {
    return {
      SITE: intl.get(`${modelPrompt}.site`).d('站点'),
    };
  }, []);

  const changeFlag = (record: Record, _ds: DataSet) => {
    setUserDefaultOrganization.run({
      params: record.get('userOrganizationId'),
      onSuccess: () => {
        const oldDefaultRecord = _ds.find(record => record.get('defaultOrganizationFlag') === 'Y');
        if (oldDefaultRecord) {
          oldDefaultRecord.init('defaultOrganizationFlag', 'N');
        }
        record.init('defaultOrganizationFlag', 'Y');
      },
    });
  };

  const siteListColumns: ColumnProps[] = useMemo(() => {
    return [
      {
        name: 'organizationCode',
        title: labelMap.SITE,
        renderer: ({ value }) => <Popover content={value}>{value}</Popover>,
      },
      {
        name: 'defaultOrganizationFlag',
        title: intl.get(`${modelPrompt}.defaultOrganizationFlag`).d('默认状态'),
        align: ColumnAlign.center,
        width: 80,
        renderer: ({ value, record }) => {
          return <Radio checked={value === 'Y'} onChange={() => changeFlag(record!, siteListDs)} />;
        },
      },
    ];
  }, []);
  return (
    <Table
      virtual
      virtualCell
      className={styles.tableToolHide}
      style={{ height: maxHeight }}
      dataSet={siteListDs}
      columns={siteListColumns}
    />
  );
});

export default OrganizationTable;
