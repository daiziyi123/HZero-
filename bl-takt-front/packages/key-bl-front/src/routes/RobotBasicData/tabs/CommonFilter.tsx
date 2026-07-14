/*
 * @Description: 公共筛选栏组件（产线/工位/设备编号/设备名称 + 查询/重置）
 */

import React, { useEffect, useRef, useState } from 'react';
import { DataSet, TextField, Select } from 'choerodon-ui/pro';
import { Button } from 'choerodon-ui';
import { fetchLineLov, fetchWorkcellLov } from '../services';

const { Option } = Select;

interface LovOption {
  meaning: string;
  value: number | string;
}

export interface QueryParamMap {
  /** 产线查询参数名，默认 'line' */
  line?: string;
  /** 工位查询参数名，默认 'workcell' */
  workcell?: string;
  /** 设备编号查询参数名，默认 'deviceCode' */
  deviceCode?: string;
  /** 设备名称查询参数名，默认 'deviceName' */
  deviceName?: string;
}

export interface CommonFilterProps {
  /** 表格 DataSet（用于搜索时传参） */
  tableDs: DataSet;
  /** 是否显示设备编号筛选条件，默认 true */
  showDeviceCode?: boolean;
  /** 是否显示设备名称筛选条件，默认 true */
  showDeviceName?: boolean;
  /** 查询参数名称映射，将前端筛选字段映射到后端接口查询参数名 */
  queryParamMap?: QueryParamMap;
  /** 筛选栏额外内容（如备件气缸的额外下拉框和输入框） */
  extraChildren?: React.ReactNode;
  /** 重置时回调，用于清空额外筛选条件 */
  onReset?: () => void;
  /** 工位变更回调，用于外部联动（如夹具设备下拉） */
  onWorkcellChange?: (workcellId: string | undefined) => void;
  /** 产线变更回调，用于外部联动 */
  onLineChange?: (lineId: string | undefined) => void;
}

const defaultQueryParamMap: Required<QueryParamMap> = {
  line: 'prodLineId',
  workcell: 'workcellId',
  deviceCode: 'deviceCode',
  deviceName: 'deviceName',
};

const CommonFilter = (props: CommonFilterProps) => {
  const {
    tableDs,
    showDeviceCode = true,
    showDeviceName = true,
    queryParamMap,
    extraChildren,
    onReset: onExtraReset,
    onWorkcellChange,
    onLineChange,
  } = props;

  const paramMap = { ...defaultQueryParamMap, ...queryParamMap };

  const [deviceCode, setDeviceCode] = useState('');
  const [deviceName, setDeviceName] = useState('');

  // 产线下拉
  const [lineOptions, setLineOptions] = useState<LovOption[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | undefined>(undefined);

  // 工位下拉（产线联动）
  const [workcellOptions, setWorkcellOptions] = useState<LovOption[]>([]);
  const [selectedWorkcell, setSelectedWorkcell] = useState<string | undefined>(undefined);

  const tableDsRef = useRef(tableDs);
  tableDsRef.current = tableDs;

  // 初始化加载产线下拉数据
  useEffect(() => {
    fetchLineLov()
      .then((res: any) => {
        if (res && res.content) {
          setLineOptions(res.content);
        }
      })
      .catch((err: any) => {
        console.error('获取产线下拉数据失败:', err);
      });
  }, []);

  // 产线变更时，联动加载工位下拉数据
  useEffect(() => {
    if (selectedLine) {
      // 清空工位选中值
      setSelectedWorkcell(undefined);
      onWorkcellChange?.(undefined);
      // 调用工位接口（后端接口待提供，暂做容错处理）
      fetchWorkcellLov(selectedLine)
        .then((res: any) => {
          if (res && res.content) {
            setWorkcellOptions(res.content);
          } else {
            setWorkcellOptions([]);
          }
        })
        .catch((err: any) => {
          console.error('获取工位下拉数据失败:', err);
          setWorkcellOptions([]);
        });
    } else {
      // 未选产线时清空工位
      setWorkcellOptions([]);
      setSelectedWorkcell(undefined);
      onWorkcellChange?.(undefined);
    }
  }, [selectedLine]);

  const handleSearch = () => {
    tableDsRef.current.setQueryParameter(paramMap.line, selectedLine);
    tableDsRef.current.setQueryParameter(paramMap.workcell, selectedWorkcell);
    tableDsRef.current.setQueryParameter(paramMap.deviceCode, deviceCode);
    tableDsRef.current.setQueryParameter(paramMap.deviceName, deviceName);
    tableDsRef.current.query();
  };

  const handleReset = () => {
    setSelectedLine(undefined);
    setSelectedWorkcell(undefined);
    onWorkcellChange?.(undefined);
    setWorkcellOptions([]);
    setDeviceCode('');
    setDeviceName('');
    onExtraReset?.();
    tableDsRef.current.setQueryParameter(paramMap.line, undefined);
    tableDsRef.current.setQueryParameter(paramMap.workcell, undefined);
    tableDsRef.current.setQueryParameter(paramMap.deviceCode, undefined);
    tableDsRef.current.setQueryParameter(paramMap.deviceName, undefined);
    tableDsRef.current.reset();
    tableDsRef.current.query();
  };

  return (
    <div className="bt-filter-bar">
      <div className="bt-filter-row">
        <div className="bt-filter-item">
          <span className="bt-filter-label">产线</span>
          <Select
            className="bt-filter-select"
            value={selectedLine}
            onChange={(v: any) => {
              setSelectedLine(v);
              onLineChange?.(v);
            }}
            placeholder="全部"
          >
            {lineOptions.map((opt) => (
              <Option key={String(opt.value)} value={String(opt.value)}>
                {opt.meaning}
              </Option>
            ))}
          </Select>
        </div>
        <div className="bt-filter-item">
          <span className="bt-filter-label">工位</span>
          <Select
            className="bt-filter-select"
            value={selectedWorkcell}
            onChange={(v: any) => {
              setSelectedWorkcell(v);
              onWorkcellChange?.(v);
            }}
            placeholder={selectedLine ? '全部' : '请先选择产线'}
            disabled={!selectedLine}
          >
            {workcellOptions.map((opt) => (
              <Option key={String(opt.value)} value={String(opt.value)}>
                {opt.meaning}
              </Option>
            ))}
          </Select>
        </div>
        {showDeviceCode && (
          <div className="bt-filter-item">
            <span className="bt-filter-label">设备编号</span>
            <TextField
              className="bt-filter-input"
              placeholder="设备编号"
              value={deviceCode}
              onChange={(value) => setDeviceCode(value)}
            />
          </div>
        )}
        {showDeviceName && (
          <div className="bt-filter-item">
            <span className="bt-filter-label">设备名称</span>
            <TextField
              className="bt-filter-input"
              placeholder="设备名称"
              value={deviceName}
              onChange={(value) => setDeviceName(value)}
            />
          </div>
        )}
        {/* 各 Tab 额外的筛选条件 */}
        {extraChildren}
        <div className="bt-filter-actions">
          <Button type="primary" className="bt-filter-btn-search" onClick={handleSearch}>查询</Button>
          <Button className="bt-filter-btn-reset" onClick={handleReset}>重置</Button>
        </div>
      </div>
    </div>
  );
};

export default CommonFilter;
