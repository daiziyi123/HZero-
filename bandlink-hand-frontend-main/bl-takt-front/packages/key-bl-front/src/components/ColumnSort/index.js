import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { DataSet, Table, Button, Modal } from 'choerodon-ui/pro';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const ColumnSort = (props) => {
  const { customizedCode } = props;
  const [dataSetObj, setDataSetObj] = useState(null);
  // const [dataSource, setDataSource] = useState([]);
  const [originDataSource, setOriginDataSource] = useState([]);

  const dataSet = useMemo(() => new DataSet(dataSetObj), [dataSetObj]);

  useEffect(() => {
    if (localStorage.getItem(customizedCode)) {
      props.onChange(JSON.parse(localStorage.getItem(customizedCode)));
    }
    getColumns();
  }, []);

  useEffect(() => {
    dataSet.loadData(originDataSource);
  }, [dataSetObj]);

  const getColumns = useCallback(() => {
    const columns = JSON.parse(localStorage.getItem(customizedCode)) || props.columns;
    const newDataSource = columns.map((e) => ({
      ...e,
      name: e.name,
      title: e.title,
      hidden: e.hidden || false,
      lock: e.lock || null,
    }));
    setOriginDataSource(newDataSource);

    setDataSetObj({
      autoQuery: false,
      selection: false,
      paging: false,
      fields: [
        {
          name: 'hidden',
          label: intl.get(`hzero.common.columnName.hide`).d('隐藏'),
          type: FieldType.boolean,
        },
        {
          name: 'name',
          label: intl.get(`hzero.common.columnName.field`).d('字段'),
          type: FieldType.string,
        },
        {
          name: 'lock',
          label: 'LOCK',
          type: FieldType.string,
          options: new DataSet({
            data: [
              { value: 'left', meaning: intl.get(`hzero.common.value.left`).d('靠左') },
              { value: 'right', meaning: intl.get(`hzero.common.value.right`).d('靠右') },
            ],
          }),
        },
      ],
    });
  }, [props.columns]);

  const columns = [
    { name: 'hidden', width: 70, editor: true },
    {
      name: 'title',
      title: intl.get(`hzero.common.columnName.field`).d('字段'),
    },
    {
      name: 'lock',
      title: 'LOCK',
      editor: true,
      width: 70,
    },
  ];

  const handleOpenChangeColumnsModal = () => {
    const recordModalKey = Modal.key();
    const modal = Modal.open({
      key: recordModalKey,
      title: intl.get(`hzero.common.title.columnSorting`).d('列排序'),
      drawer: true,
      closable: true,
      style: { width: 400 },
      children: (
        <Table
          dataSet={dataSet}
          columns={columns}
          queryFieldsLimit={3}
          pagination={{ showPager: true }}
          rowHeight={34}
          dragColumnAlign="left"
          rowDraggable
          // onDragEnd={handleDragEnd}
          queryBarProps={{ autoQueryAfterReset: false }}
        />
      ),
      okText: intl.get(`hzero.common.button.save`).d('保存'),
      destroyOnClose: false,
      onOk: () => {
        const newDataSource = dataSet.toData();
        props.onChange(newDataSource);
        if (customizedCode) {
          localStorage.setItem(customizedCode, JSON.stringify(newDataSource));
        }
      },
      onCancel: () => {
        modal.close();
        dataSet.loadData(originDataSource);
      },
    });
  };

  return (
    <Fragment>
      <Button funcType="flat" icon="menu" onClick={handleOpenChangeColumnsModal} />
    </Fragment>
  );
};
export default ColumnSort;
