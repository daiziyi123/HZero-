/**
 * @Description: 综合健康概览页面
 * @Author: Assistant
 * @Date: 2026-06-25
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterBar from './components/FilterBar';
import ZoneSection from './components/ZoneSection';
import DeviceDetailPanel from './components/DeviceDetailPanel';
import { DeviceInfo, ZoneInfo, robotStatusOptions } from './data/mockData';
import {
  listRobotDashboardHealth,
  ProdLineRobotHealth,
  RobotHealthItem,
  listRobotBatchStatus,
  BatchStatusParams,
  BatchStatusResponse,
  PropertyData,
} from './services';
import statusConfig from '@/config/statusConfig';
import { message } from 'choerodon-ui';

/** 国际化模块前缀 */
const modelPrompt = 'tarzan.comprehensiveHealthOverview';

/** 根据 healthLevelCode 计算健康等级名称 */
const getHealthLevelName = (healthLevelCode?: number): DeviceInfo['status'] => {
  switch (healthLevelCode) {
    case 1:
      return '健康';
    case 2:
      return '良好';
    case 3:
      return '警告';
    case 4:
      return '严重';
    default:
      return '良好';
  }
};

/** 批量状态查询点位 key 列表（从 statusConfig.robot 取值） */
const STATUS_POINT_KEYS: string[] = Object.values(statusConfig.robot);

  /** 根据点位属性值计算机器人运行状态（仅由 state 点位决定，与 alarm 独立） */
const getRobotStatusFromProps = (
  /** 状态点位数据 */
  stateData?: PropertyData,
): DeviceInfo['robotStatus'] => {
  /** 状态点位原始值 */
  const stateVal = (stateData?.value || '').toLowerCase();
  /** 状态点位 quality 或 value 为空，视为未采集 */
  if (!stateData || stateData.value === undefined || stateData.value === null || stateVal === '') {
    return 'uncollected';
  }
  // 1: 运行中 / running
  if (stateVal === 'running' || stateVal === '1') return 'running';
  // 2: 待机 / standby
  if (stateVal === 'standby' || stateVal === 'ready' || stateVal === 'idle' || stateVal === '2') return 'standby';
  // 3: 急停 / abnormal
  if (stateVal === 'stop' || stateVal === 'emergency' || stateVal === 'abnormal' || stateVal === '3') return 'abnormal';
  // 4: 报警 / alarm
  if (stateVal === 'alarm' || stateVal === '4') return 'alarm';
  // 5: 离线 / offline
  if (stateVal === 'offline' || stateVal === '5') return 'offline';
  // 其他值兜底为未采集
  return 'uncollected';
};

/** 根据 alarm 点位判断是否需要显示设备异常告警条 */
const getAlarmFlagFromProps = (
  /** 报警点位数据 */
  alarmData?: PropertyData,
): boolean => {
  /** 报警点位原始值 */
  const alarmVal = alarmData?.value || '';
  return Boolean(alarmVal && alarmVal !== '0' && alarmVal !== 'false');
};

/** 将接口机器人数据转换为页面 DeviceInfo */
const transformRobotToDevice = (robot: RobotHealthItem, zoneId: string): DeviceInfo => ({
  id: String(robot.equipmentId),
  code: robot.equipmentCode,
  name: robot.equipmentName || '-',
  type: robot.childEquipmentTypeMeaning || robot.childEquipmentType || '-',
  score: robot.score || 0,
  status: getHealthLevelName(robot.healthLevelCode),
  isRunning: false,
  zoneId,
  robotStatus: undefined,
});

/** 将接口产线数据转换为页面 ZoneInfo */
const transformProdLineToZone = (prodLine: ProdLineRobotHealth): ZoneInfo => ({
  id: String(prodLine.prodLineId || prodLine.prodLineCode),
  name: prodLine.prodLineName || '-',
  totalCount: prodLine.robots?.length || 0,
  runningCount: 0,
  warningCount: 0,
  devices: (prodLine.robots || []).map((robot) => transformRobotToDevice(robot, String(prodLine.prodLineId || prodLine.prodLineCode))),
});

const ComprehensiveHealthOverview = () => {
  /** 筛选器选中的机器人运行状态（如 running/standby/alarm 等） */
  const [selectedRobotStatus, setSelectedRobotStatus] = useState<string[]>([]);
  /** 筛选器选中的健康等级（健康/良好/警告/严重） */
  const [selectedHealthLevel, setSelectedHealthLevel] = useState<string[]>([]);
  /** 数据最后更新时间，显示在筛选栏右侧 */
  const [lastUpdateTime, setLastUpdateTime] = useState('09:53:17');
  /** 当前选中的设备详情数据（右侧抽屉面板使用） */
  const [detailDevice, setDetailDevice] = useState<DeviceInfo | null>(null);
  /** 设备详情抽屉面板显隐控制 */
  const [detailVisible, setDetailVisible] = useState(false);
  /** 接口返回的原始产线-设备健康数据（未合并状态） */
  const [rawZones, setRawZones] = useState<ZoneInfo[]>([]);
  /** 机器人 code → 实时运行状态的映射表（由批量状态接口生成） */
  const [robotStatusMap, setRobotStatusMap] = useState<Record<string, DeviceInfo['robotStatus']>>({});
  /** 机器人 code → 是否显示报警条的映射表（由 alarm 点位生成） */
  const [alarmMap, setAlarmMap] = useState<Record<string, boolean>>({});
  /** 缓存当前所有机器人 code，供轮询复用（避免依赖 rawZones 状态触发） */
  const robotCodesRef = useRef<string[]>([]);

  // 批量加载机器人实时运行状态（基于 codes 数组）
  const loadRobotBatchStatus = useCallback(async (codes: string[]) => {
    if (codes.length === 0) return;

    try {
      /** 批量状态请求参数：{ 机器人code: ['state','alarm'] } 格式 */
      const params: BatchStatusParams = {};
      codes.forEach((code) => {
        params[code] = STATUS_POINT_KEYS;
      });
      // console.log('params', params);
      /** 批量状态接口返回：{ 机器人code: { state: PropertyData, alarm: PropertyData } } */
      const res: BatchStatusResponse = await listRobotBatchStatus(params);
      /** 解析后的机器人 code → robotStatus 映射 */
      const map: Record<string, DeviceInfo['robotStatus']> = {};
      /** 解析后的机器人 code → 是否显示报警条映射 */
      const alarmMap: Record<string, boolean> = {};

      Object.keys(res || {}).forEach((code) => {
        /** 单个机器人的点位属性数据 */
        const points = res[code];
        if (points) {
          map[code] = getRobotStatusFromProps(points[statusConfig.robot.state]);
          alarmMap[code] = getAlarmFlagFromProps(points[statusConfig.robot.alarm]);
        }
      });

      setRobotStatusMap(map);
      setAlarmMap(alarmMap);
    } catch (error) {
      console.error('获取机器人实时状态失败', error);
    }
  }, []);

  // 加载产线维度机器人健康数据 → 完成后立即加载状态
  const loadDashboardData = useCallback(async () => {
    try {
      /** 健康数据接口返回原始列表 */
      const res: ProdLineRobotHealth[] = await listRobotDashboardHealth();
      /** 空值兜底：确保 res 为数组 */
      const list = Array.isArray(res) ? res : [];
      /** 将原始健康数据转换为页面 ZoneInfo 结构 */
      const newZones = list.map(transformProdLineToZone);
      setRawZones(newZones);

      // 收集所有机器人 code
      /** 提取所有产线下全部机器人的 equipmentCode */
      const codes: string[] = [];
      newZones.forEach((zone) => {
        zone.devices.forEach((device) => {
          if (device.code) codes.push(device.code);
        });
      });

      robotCodesRef.current = codes;
      // 健康数据加载完成后，立即调用状态接口
      await loadRobotBatchStatus(codes);
    } catch (error) {
      console.error('加载综合健康概览数据失败', error);
      setRawZones([]);
    }
  }, [loadRobotBatchStatus]);

  // 初始化加载
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 机器人状态定时轮询（每10秒）
  useEffect(() => {
    /** 轮询定时器：每10秒拉取最新机器人状态 */
    const timer = setInterval(() => {
      if (robotCodesRef.current.length > 0) {
        loadRobotBatchStatus(robotCodesRef.current);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [loadRobotBatchStatus]);

  // 合并健康数据与实时状态，构建最终展示 zones
  const displayZones = useMemo<ZoneInfo[]>(() => {
    return rawZones.map((zone) => {
      /** 将实时状态与报警标志注入每个设备，生成最终展示用的设备列表 */
      const mergedDevices = zone.devices.map((device) => ({
        ...device,
        robotStatus: device.code ? robotStatusMap[device.code] : undefined,
        isAlarm: device.code ? alarmMap[device.code] : false,
      }));

      return {
        ...zone,
        devices: mergedDevices,
        runningCount: mergedDevices.filter((d) => d.robotStatus === 'running').length,
        warningCount: mergedDevices.filter(
          (d) => d.robotStatus === 'abnormal' || d.robotStatus === 'alarm' || d.robotStatus === 'offline' || d.robotStatus === 'uncollected',
        ).length,
      };
    });
  }, [rawZones, robotStatusMap, alarmMap]);

  // 根据所有设备的 robotStatus 动态统计各状态数量（用于 FilterBar 展示）
  const statusCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    robotStatusOptions.forEach((option) => {
      counts[option.key] = 0;
    });
    displayZones.forEach((zone) => {
      zone.devices.forEach((device) => {
        const key = device.robotStatus || 'uncollected';
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return counts;
  }, [displayZones]);

  // 实时更新时间 - 每3秒更新
  useEffect(() => {
    // 初始化当前时间
    /** 初始化时的当前时间对象 */
    const now = new Date();
    /** 格式化为 HH:MM:SS 的时间字符串 */
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    setLastUpdateTime(timeStr);

    // 每秒更新
    /** 定时器句柄 */
    const timer = setInterval(() => {
      /** 每次轮询时的当前时间对象 */
      const currentTime = new Date();
      /** 格式化后的时间字符串 */
      const timeStr = currentTime.toLocaleTimeString('zh-CN', { hour12: false });
      setLastUpdateTime(timeStr);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /** 处理刷新操作：更新时间戳并重新加载全部数据 */
  const handleRefresh = () => {
    /** 刷新时的当前时间对象 */
    const now = new Date();
    /** 格式化时间字符串 */
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    setLastUpdateTime(timeStr);
    loadDashboardData();
    message.success('数据已更新');
  };

  /** 处理设备详情点击：打开右侧抽屉面板 */
  const handleDeviceDetailClick = (device: DeviceInfo) => {
    setDetailDevice(device);
    setDetailVisible(true);
  };

  /** 关闭详情面板：隐藏右侧抽屉 */
  const handleCloseDetail = () => {
    setDetailVisible(false);
  };

  return (
    <div className="comprehensive-health-overview">
      <Header title={intl.get(`${modelPrompt}.title`).d('综合健康概览')} />
      <Content>
        <FilterBar
          selectedRobotStatus={selectedRobotStatus}
          selectedHealthLevel={selectedHealthLevel}
          lastUpdateTime={lastUpdateTime}
          statusCounts={statusCounts}
          onRobotStatusChange={setSelectedRobotStatus}
          onHealthLevelChange={setSelectedHealthLevel}
          onRefresh={handleRefresh}
        />

        <div className="zones-container">
          {displayZones.map((zone) => (
            <ZoneSection
              key={zone.id}
              zone={zone}
              onDeviceDetailClick={handleDeviceDetailClick}
            />
          ))}
        </div>
      </Content>

      {/* 设备详情右侧面板 */}
      <DeviceDetailPanel
        device={detailDevice}
        visible={detailVisible}
        onClose={handleCloseDetail}
      />

      <style>{`
        .comprehensive-health-overview {
          background: #f5f7fa;
        }

        /* 区域容器样式 */
        .zones-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  );
};

/** 导出带国际化与 MobX 响应式的页面组件 */
export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(ComprehensiveHealthOverview));
