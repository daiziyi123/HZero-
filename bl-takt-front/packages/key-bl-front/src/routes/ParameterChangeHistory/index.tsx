/*
 * @Description: 参数变更履历 - 主页面
 */

import React, { useState } from 'react';
import { Tabs } from 'choerodon-ui/pro';
import { Button, Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import ParamChangeTab from './components/ParamChangeTab';
import {
  cylinderDevices,
  initialCylinderCurrentId,
  initialCylinderVersions,
  initialRobotCurrentId,
  initialRobotVersions,
  initialServoCurrentId,
  initialServoVersions,
  robotDevices,
  servoDevices,
} from './data/mockData';

const modelPrompt = 'tarzan.parameterChangeHistory';

const ParameterChangeHistory = () => {
  const [activeKey, setActiveKey] = useState('robot');

  const handleBack = () => {
    window.history.back();
  };

  const renderTabContent = () => {
    switch (activeKey) {
      case 'robot':
        return (
          <ParamChangeTab
            key="robot"
            type="robot"
            deviceMap={robotDevices}
            initialVersions={initialRobotVersions}
            initialCurrentId={initialRobotCurrentId}
          />
        );
      case 'servo':
        return (
          <ParamChangeTab
            key="servo"
            type="servo"
            deviceMap={servoDevices}
            initialVersions={initialServoVersions}
            initialCurrentId={initialServoCurrentId}
          />
        );
      case 'cylinder':
        return (
          <ParamChangeTab
            key="cylinder"
            type="cylinder"
            deviceMap={cylinderDevices}
            initialVersions={initialCylinderVersions}
            initialCurrentId={initialCylinderCurrentId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="parameter-change-history-page">
      <Header title={intl.get(`${modelPrompt}.title`).d('参数变更履历')}>
        <Button key="back" icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回总览')}
        </Button>
      </Header>

      <Content>
        <div className="pch-page-header">
          <div className="pch-title-section">
            <h1>
              <Icon type="history" className="pch-title-icon" />
              参数变更履历
            </h1>
            <p>机器人 · 伺服电机 · 夹具气缸 | 单设备版本记录 · 参数对比 · 变更追溯</p>
          </div>
        </div>

        <div className="pch-tabs-container">
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            className="pch-tabs"
          >
            <Tabs.TabPane
              tab={
                <span className="pch-tab-label">
                  <Icon type="smart_toy" />
                  机器人参数
                </span>
              }
              key="robot"
            />
            <Tabs.TabPane
              tab={
                <span className="pch-tab-label">
                  <Icon type="memory" />
                  伺服电机参数
                </span>
              }
              key="servo"
            />
            <Tabs.TabPane
              tab={
                <span className="pch-tab-label">
                  <Icon type="speed" />
                  夹具气缸参数
                </span>
              }
              key="cylinder"
            />
          </Tabs>

          <div className="pch-tab-content">{renderTabContent()}</div>
        </div>

        <div className="pch-footer-note">
          📌 请先选择设备，再导入Excel模板。红色圆点标识与上一版本有差异的参数值，鼠标悬停显示前后对比。
        </div>
      </Content>

      <style>{`
        .parameter-change-history-page {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #f5f7fa;
        }

        .parameter-change-history-page .page-content {
          background: #f5f7fa;
        }

        .pch-page-header {
          margin-bottom: 16px;
        }

        .pch-title-section h1 {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0f172a;
          margin: 0;
        }

        .pch-title-icon {
          color: #2563eb !important;
          font-size: 24px !important;
        }

        .pch-title-section p {
          color: #64748b;
          margin: 4px 0 0;
          font-size: 13px;
        }

        .pch-tabs-container {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 600px;
        }

        .pch-tabs .c7n-tabs-bar {
          margin: 0;
          padding: 0 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .pch-tabs .c7n-tabs-tab {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
        }

        .pch-tabs .c7n-tabs-tab-active {
          color: #2563eb;
          background: #ffffff;
        }

        .pch-tab-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .pch-tab-label i {
          font-size: 16px;
        }

        .pch-tab-content {
          flex: 1;
          padding: 18px 20px;
          background: #ffffff;
          overflow: auto;
        }

        .pch-tab-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }

        .pch-version-section {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .pch-param-section {
          flex: 2;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .pch-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 12px;
        }

        .pch-device-selector {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          background: #f8fafc;
          padding: 6px 14px;
          border-radius: 50px;
        }

        .pch-device-select {
          min-width: 140px;
        }

        .pch-device-select .c7n-pro-select {
          border-radius: 50px !important;
        }

        .pch-toolbar-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pch-btn-primary {
          background: #2563eb !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 50px !important;
          font-size: 12px !important;
          height: 32px !important;
          padding: 0 16px !important;
        }

        .pch-btn-primary:hover {
          background: #1d4ed8 !important;
        }

        .pch-btn-outline {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          border-radius: 50px !important;
          font-size: 12px !important;
          height: 32px !important;
          padding: 0 14px !important;
        }

        .pch-btn-outline:hover {
          background: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }

        .pch-btn-sm {
          padding: 2px 8px !important;
          height: 26px !important;
          font-size: 12px !important;
        }

        .pch-table-wrapper {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        /* 分页默认 5 条/页不变；可见区域 = 表头 + 3 行数据（42px/行），其余行表格内滚动 */
        .pch-table-wrapper--rows-3 {
          --pch-table-row-height: 42px;
          max-height: calc(var(--pch-table-row-height) * 4);
          overflow-y: auto;
        }

        .pch-table-wrapper--rows-3 .pch-table th,
        .pch-table-wrapper--rows-3 .pch-table td {
          height: var(--pch-table-row-height);
          box-sizing: border-box;
          line-height: 1.4;
          overflow: hidden;
        }

        .pch-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          background: #ffffff;
        }

        .pch-table th,
        .pch-table td {
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 10px;
          text-align: center;
          vertical-align: middle;
          color: #1e293b;
        }

        .pch-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
          font-size: 12px;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .pch-table tbody tr:hover {
          background: #f8fafc;
        }

        .pch-row-selected {
          background: #eef2ff !important;
        }

        .pch-row-selected:hover {
          background: #eef2ff !important;
        }

        .pch-search-box {
          margin: 6px 0 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pch-search-box input {
          padding: 6px 12px;
          border-radius: 50px;
          border: 1px solid #e2e8f0;
          width: 260px;
          font-size: 12px;
          color: #1e293b;
          outline: none;
        }

        .pch-search-box input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .pch-pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .pch-pagination button,
        .pch-pagination select {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 12px;
          color: #475569;
        }

        .pch-pagination button:hover:not(:disabled) {
          background: #f1f5f9;
        }

        .pch-pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pch-pagination span {
          color: #64748b;
          font-size: 12px;
        }

        .pch-pagination select {
          height: 28px;
        }

        .pch-diff-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #e53935;
          color: #ffffff;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          font-weight: bold;
          margin-left: 8px;
          cursor: pointer;
        }

        .pch-footer-note {
          margin-top: 14px;
          text-align: right;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(
  observer(ParameterChangeHistory),
);
