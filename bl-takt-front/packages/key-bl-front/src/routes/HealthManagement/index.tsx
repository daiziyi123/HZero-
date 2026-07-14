/**
 * @Description: 健康管理页面
 * @Author: Assistant
 * @Date: 2026-06-23
 */

import React, { useMemo, useState } from 'react';
import { Table, DataSet, Button, Tabs, Select } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { robotTableDS, servoMotorTableDS, cylinderTableDS, robotFilterDS } from './store/index';
import EditModal from './components/EditModal';
import ConfigModal from './components/ConfigModal';
const { Option } = Select;

const modelPrompt = 'tarzan.healthManagement';

const HealthManagement = () => {
  const [activeTab, setActiveTab] = useState('robot');
  const [visible, setVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [configVisible, setConfigVisible] = useState(false);
  const [plannedTime, setPlannedTime] = useState('16');
  const [alarmBase, setAlarmBase] = useState('10');
  const [ratedValue, setRatedValue] = useState('');
  // 夹具气缸类参数配置
  const [waveFullUpper, setWaveFullUpper] = useState('5');
  const [waveMiddleUpper, setWaveMiddleUpper] = useState('10');
  const [alarmFullCount, setAlarmFullCount] = useState('0');
  const [alarmMiddleUpperCount, setAlarmMiddleUpperCount] = useState('2');
  const [lifeFullThreshold, setLifeFullThreshold] = useState('20');
  const [lifeMiddleLower, setLifeMiddleLower] = useState('10');
  const [lifeMiddleUpper, setLifeMiddleUpper] = useState('10');

  const robotDs = useMemo(() => new DataSet(robotTableDS()), []);
  const robotFilterDs = useMemo(() => new DataSet(robotFilterDS()), []);
  const servoDs = useMemo(() => new DataSet(servoMotorTableDS()), []);
  const cylinderDs = useMemo(() => new DataSet(cylinderTableDS()), []);
  const categoryOptions = () => [
    { value: '0', label: '全部' },
    { value: '1', label: '搬送机器人' },
    { value: '2', label: '涂胶机器人' },
    { value: '3', label: 'FDS机器人' },
    { value: '4', label: 'SPR机器人' },
    { value: '5', label: '焊接机器人' },
  ]
  const handleEdit = (record: any) => {
    setEditRecord(record);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setEditRecord(null);
  };

  const handleConfigOpen = () => {
    setConfigVisible(true);
  };

  const handleConfigClose = () => {
    setConfigVisible(false);
  };

  const handleConfigSave = () => {
    console.log('保存配置:', { plannedTime, alarmBase });
    setConfigVisible(false);
  };

  const columns: ColumnProps[] = useMemo(() => [
    {
      name: 'indicatorName',
      label: intl.get(`${modelPrompt}.indicatorName`).d('指标名称'),
      width: 200,
      align: ColumnAlign.center,
    },
    {
      name: 'category',
      label: intl.get(`${modelPrompt}.category`).d('类别'),
      width: 200,
      align: ColumnAlign.center,
    },
    {
      name: 'weight',
      label: intl.get(`${modelPrompt}.weight`).d('权重(%)'),
      width: 200,
      align: ColumnAlign.center,
    },
    {
      name: 'formula',
      label: intl.get(`${modelPrompt}.formula`).d('计算公式/关键参数'),
      align: ColumnAlign.center,
    },
    {
      name: 'enabled',
      label: intl.get(`${modelPrompt}.enabled`).d('是否启用'),
      width: 100,
      align: ColumnAlign.center,
      renderer: ({ value, record }) => (
        <input
          type="checkbox"
          checked={value}
          onChange={(e: any) => {
            record.set('enabled', e.target.checked);
          }}
          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
        />
      ),
    },
    {
      name: 'operation',
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      align: ColumnAlign.center,
      lock: ColumnLock.right,
      renderer: ({ record }) => (
        <Button
          funcType={FuncType.flat}
          onClick={() => handleEdit(record)}
          style={{ padding: 0, border: 'none', fontSize: '16px', color: '#1890ff' }}
        >
          {/* <Icon type="edit_location_alt-o" /> */}
          {/* <Icon type="edit_note" /> */}
          <Icon type="drive_file_rename_outline" />
        </Button>
      ),
    },
  ], []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  const handleChangeRobotType = (value, oldValue) => {
    console.log('[new值：]', value, '[old值：]', oldValue);
  }
  const renderTable = () => {
    switch (activeTab) {
      case 'robot':
        return (
          <div className="health-management-tab-content">
            <div className="health-management-filter">
              <span className="health-management-filter-label">
                {intl.get(`${modelPrompt}.robotType`).d('机器人类别')}
              </span>
              <Select
                style={{ width: 180 }}
                name="robotType"
                dataSet={robotFilterDs}
                onChange={handleChangeRobotType}
              >
                {/* {categoryOptions().map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))} */}
              </Select>
              <Button
                key="config"
                funcType={FuncType.flat}
                icon="settings"
                className="health-management-config-btn"
                onClick={handleConfigOpen}
              >
                {intl.get(`${modelPrompt}.paramConfig`).d('参数配置')}
              </Button>
            </div>
            <Table
              dataSet={robotDs}
              columns={columns}
              queryBar={false}
              pagination={true}
              paginationProps={{ showSizeChanger: true }}
            />
          </div>
        );
      case 'servo':
        return (
          <div className="health-management-tab-content">
            <div className="health-management-filter">
              <Button
                key="config"
                funcType={FuncType.flat}
                icon="settings"
                className="health-management-config-btn"
                onClick={handleConfigOpen}
              >
                {intl.get(`${modelPrompt}.paramConfig`).d('参数配置')}
              </Button>
            </div>
            <Table
              dataSet={servoDs}
              columns={columns}
              queryBar={false}
              pagination={true}
              paginationProps={{ showSizeChanger: true }}
            />
          </div>
        );
      case 'cylinder':
        return (
          <div className="health-management-tab-content">
            <div className="health-management-filter">
              <Button
                key="config"
                funcType={FuncType.flat}
                icon="settings"
                className="health-management-config-btn"
                onClick={handleConfigOpen}
              >
                {intl.get(`${modelPrompt}.paramConfig`).d('参数配置')}
              </Button>
            </div>
            <Table
              dataSet={cylinderDs}
              columns={columns}
              queryBar={false}
              pagination={true}
              paginationProps={{ showSizeChanger: true }}
            />
          </div>
        );
      default:
        return null;
    }
  };
  const handleChange = (value, oldValue) => {
    console.log('[new值：]', value, '[old值：]', oldValue);
  }
  return (
    <div className="health-management-page">
      <Header title={intl.get(`${modelPrompt}.title`).d('健康管理')} />
      <Content>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="health-management-tabs"
        >
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="smart_toy" style={{ fontSize: 18 }} />
                {intl.get(`${modelPrompt}.robotTab`).d('机器人类')}
              </span>
            }
            key="robot"
          />
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="memory" style={{ fontSize: 18 }} />
                {intl.get(`${modelPrompt}.servoTab`).d('伺服电机类')}
              </span>
            }
            key="servo"
          />
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {/* <Icon type="network_check" style={{ fontSize: 18 }} /> */}
                <Icon type="handyman" style={{ fontSize: 18 }} />
                {intl.get(`${modelPrompt}.cylinderTab`).d('夹具气缸类')}
              </span>
            }
            key="cylinder"
          />
        </Tabs>
        {renderTable()}
      </Content>
      <style>{`
          .c7n-pro-select {
            border-radius: 10px !important;
          }
          .health-management-page {
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .health-management-tabs {
            background: #ffffff;
            border-bottom: 1px solid #e8e8e8;
          }

          .health-management-tabs .c7n-tabs-bar {
            margin: 0;
            padding: 0 24px;
            background: #ffffff;
          }

          .health-management-tabs .c7n-tabs-tab {
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color:rgb(100, 116, 139);
            margin-right: 0;
            border-right: 1px solid #e8e8e8;
            border-radius: 10px 10px 0 0;
          }

          .health-management-tabs .c7n-tabs-tab:first-child {
            border-left: 1px solid #e8e8e8;
          }

          .health-management-tabs .c7n-tabs-tab-active {
            color: #1890ff;
            background: #e6f7ff;
          }

          .health-management-tabs .c7n-tabs-tab i {
            margin-right: 8px;
            font-size: 14px;
          }

          .health-management-tab-content {
            background: #ffffff;
            padding: 24px;
            color: #475569;
            font-weight: 500;
          }

          .health-management-filter {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }

          .health-management-filter-label {
            font-size: 14px;
            color: #666666;
            margin-right: 8px;
          }

          .health-management-config-btn {
            width: 100px;
            margin-left: auto;
            // color: #1890ff; 
            border: 1px solid #d7e0e8ff;
            border-radius: 15px;
          }
        `}</style>
      <EditModal
        visible={visible}
        onClose={handleClose}
        editRecord={editRecord}
      />
      <ConfigModal
        visible={configVisible}
        onClose={handleConfigClose}
        activeTab={activeTab}
        plannedTime={plannedTime}
        setPlannedTime={setPlannedTime}
        alarmBase={alarmBase}
        setAlarmBase={setAlarmBase}
        ratedValue={ratedValue}
        setRatedValue={setRatedValue}
        waveFullUpper={waveFullUpper}
        setWaveFullUpper={setWaveFullUpper}
        waveMiddleUpper={waveMiddleUpper}
        setWaveMiddleUpper={setWaveMiddleUpper}
        alarmFullCount={alarmFullCount}
        setAlarmFullCount={setAlarmFullCount}
        alarmMiddleUpperCount={alarmMiddleUpperCount}
        setAlarmMiddleUpperCount={setAlarmMiddleUpperCount}
        lifeFullThreshold={lifeFullThreshold}
        setLifeFullThreshold={setLifeFullThreshold}
        lifeMiddleLower={lifeMiddleLower}
        setLifeMiddleLower={setLifeMiddleLower}
        lifeMiddleUpper={lifeMiddleUpper}
        setLifeMiddleUpper={setLifeMiddleUpper}
      />
    </div>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(HealthManagement));
