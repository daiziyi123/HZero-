/*
 * @Description: 三级设备选择器（产线 → 工位 → 设备）
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select } from 'choerodon-ui/pro';
import { DeviceMap, DeviceSelection } from '../types';

const { Option } = Select;

export interface DeviceSelectorProps {
  deviceMap: DeviceMap;
  value?: DeviceSelection | null;
  onChange?: (value: DeviceSelection | null) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ deviceMap, value, onChange }) => {
  const [line, setLine] = useState(value?.line || '');
  const [station, setStation] = useState(value?.station || '');
  const [device, setDevice] = useState(value?.device || '');

  const lineOptions = useMemo(() => Object.keys(deviceMap), [deviceMap]);

  const stationOptions = useMemo(() => {
    if (!line || !deviceMap[line]) return [];
    return Object.keys(deviceMap[line]);
  }, [deviceMap, line]);

  const deviceOptions = useMemo(() => {
    if (!line || !station || !deviceMap[line]?.[station]) return [];
    return deviceMap[line][station];
  }, [deviceMap, line, station]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (line && station && device) {
      onChangeRef.current?.({ line, station, device });
    } else {
      onChangeRef.current?.(null);
    }
  }, [line, station, device]);

  const handleLineChange = (val: string) => {
    setLine(val || '');
    setStation('');
    setDevice('');
  };

  const handleStationChange = (val: string) => {
    setStation(val || '');
    setDevice('');
  };

  return (
    <div className="pch-device-selector">
      <Select
        className="pch-device-select"
        placeholder="选择产线"
        value={line || undefined}
        onChange={handleLineChange}
        clearButton
      >
        {lineOptions.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
      <Select
        className="pch-device-select"
        placeholder="选择工位"
        value={station || undefined}
        onChange={handleStationChange}
        disabled={!line}
        clearButton
      >
        {stationOptions.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
      <Select
        className="pch-device-select"
        placeholder="选择设备"
        value={device || undefined}
        onChange={(val) => setDevice(val || '')}
        disabled={!station}
        clearButton
      >
        {deviceOptions.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DeviceSelector;
