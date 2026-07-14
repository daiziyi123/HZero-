import { DeviceMap, ParamVersion } from '../types';

/** 与 P06 参数变更履历.html 中 formatDateTime 一致 */
const formatDateTime = () => new Date().toLocaleString('zh-CN');

/** 与 P06 参数变更履历.html 中 robotDevices 一致 */
export const robotDevices: DeviceMap = {
  A1上件区: { 工位A1: ['焊接机器人-A1-01', '焊接机器人-A1-02', '涂胶机器人-A1-01'] },
  A2定位区: { 定位工位: ['焊接机器人-A2-01', '焊接机器人-A2-02'] },
  A3主焊区: { 主焊工位: ['焊接机器人-A3-01', '焊接机器人-A3-02'] },
};

/** 与 P06 参数变更履历.html 中 servoDevices 一致 */
export const servoDevices: DeviceMap = {
  主线: { 转台区: ['主线转台伺服 M07'], 焊接区: ['焊接转台伺服 W02'] },
  侧围线: { 提升区: ['升降机电机 E02'] },
};

/** 与 P06 参数变更履历.html 中 cylinderDevices 一致 */
export const cylinderDevices: DeviceMap = {
  侧围线: { 压紧区: ['侧围夹具气缸 C23'], 定位区: ['定位气缸 C11'] },
  主线: { 压紧区: ['压紧气缸 P04'] },
};

/**
 * 与 P06 参数变更履历.html 中 generateDemoData() 逻辑完全一致
 */
function generateDemoData() {
  const robotVersions: ParamVersion[] = [];
  const servoVersions: ParamVersion[] = [];
  const cylinderVersions: ParamVersion[] = [];

  const robotDevice = { line: 'A1上件区', station: '工位A1', deviceName: '焊接机器人-A1-01' };
  for (let i = 1; i <= 5; i += 1) {
    const verNum = `v1.${i}`;
    const changeDesc =
      i === 1
        ? '初始参数基线'
        : i === 2
          ? '优化J2轴参数'
          : i === 3
            ? '调整J4轴限位'
            : i === 4
              ? '提高J6轴速度'
              : '例行版本更新';
    robotVersions.push({
      id: 1000 + i,
      ...robotDevice,
      fileName: `robot_${verNum}.xlsx`,
      versionNumber: verNum,
      changeDesc,
      importTime: formatDateTime(),
      data: [
        ['参数名称', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6'],
        ['MASTER_COUNT', '0', '0', '0', '0', '0', '0'],
        [
          'CURRENT_POS',
          `${12.5 + i * 0.3}`,
          `${-23.1 - i * 0.2}`,
          `${45.2 + i * 0.1}`,
          `${8.9 - i * 0.1}`,
          `${-15.3 + i * 0.2}`,
          `${22.7 + i * 0.2}`,
        ],
      ],
      headers: ['参数名称', 'J1', 'J2', 'J3', 'J4', 'J5', 'J6'],
    });
  }

  const servoDevice = { line: '主线', station: '转台区', deviceName: '主线转台伺服 M07' };
  for (let i = 1; i <= 5; i += 1) {
    const verNum = `v1.${i}`;
    const changeDesc =
      i === 1
        ? '初始参数'
        : i === 2
          ? '增加增益系数'
          : i === 3
            ? '调整速度环'
            : i === 4
              ? '优化位置环'
              : `版本${i}`;
    servoVersions.push({
      id: 2000 + i,
      ...servoDevice,
      fileName: `servo_${verNum}.xlsx`,
      versionNumber: verNum,
      changeDesc,
      importTime: formatDateTime(),
      data: [
        ['1', '伺服增益', '0-100', '%', `${80 + i * 2}`, `${85 + i * 2}`],
        ['2', '速度环比例', '0-500', 'Hz', '200', '200'],
      ],
    });
  }

  const cylinderDevice = { line: '侧围线', station: '压紧区', deviceName: '侧围夹具气缸 C23' };
  for (let i = 1; i <= 5; i += 1) {
    const verNum = `v1.${i}`;
    const changeDesc =
      i === 1
        ? '初始参数'
        : i === 2
          ? '调整动作时间'
          : i === 3
            ? '减小到位延时'
          : i === 4
            ? '优化压力阈值'
            : `版本${i}`;
    cylinderVersions.push({
      id: 3000 + i,
      ...cylinderDevice,
      fileName: `cylinder_${verNum}.xlsx`,
      versionNumber: verNum,
      changeDesc,
      importTime: formatDateTime(),
      data: [
        ['1', '动作时间', '0.5-2.0', '秒', `${1.0 - i * 0.05}`, `${1.2 - i * 0.05}`],
        ['2', '到位延时', '0-1', '秒', '0.2', '0.2'],
      ],
    });
  }

  return {
    robotVersions,
    servoVersions,
    cylinderVersions,
    currentRobotId: robotVersions[0].id,
    currentServoId: servoVersions[0].id,
    currentCylinderId: cylinderVersions[0].id,
  };
}

const demoData = generateDemoData();

export const initialRobotVersions = demoData.robotVersions;
export const initialServoVersions = demoData.servoVersions;
export const initialCylinderVersions = demoData.cylinderVersions;
export const initialRobotCurrentId = demoData.currentRobotId;
export const initialServoCurrentId = demoData.currentServoId;
export const initialCylinderCurrentId = demoData.currentCylinderId;

/** 与 P06 参数变更履历.html 中 downloadTemplate 样本一致 */
export const robotTemplate = [
  ['参数名称', 'J1(deg)', 'J2(deg)', 'J3(deg)', 'J4(deg)', 'J5(deg)', 'J6(deg)'],
  ['MASTER_COUNT', '0', '0', '0', '0', '0', '0'],
  ['CURRENT_POS', '12.5', '-23.1', '45.2', '8.9', '-15.3', '22.7'],
];

export const servoTemplate = [
  ['序号', '名称', '设置范围', '单位', '初始值', '当前值'],
  ['1', '伺服增益', '0-100', '%', '80', '85'],
  ['2', '速度环比例', '0-500', 'Hz', '200', '200'],
];

export const cylinderTemplate = [
  ['序号', '名称', '设置范围', '单位', '初始值', '当前值'],
  ['1', '动作时间', '0.5-2.0', '秒', '1.0', '1.2'],
  ['2', '到位延时', '0-1', '秒', '0.2', '0.2'],
];
