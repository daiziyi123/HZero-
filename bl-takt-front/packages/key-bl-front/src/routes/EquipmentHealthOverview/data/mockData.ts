export const robotPieData = [
  { name: '健康(HI>85)', value: 12, percentage: '28.57%', color: '#18a058' },
  { name: '良好(60<HI≤85)', value: 12, percentage: '28.57%', color: '#f59e0b' },
  { name: '警告(40<HI≤60)', value: 12, percentage: '28.57%', color: '#ea580c' },
  { name: '严重(HI≤40)', value: 6, percentage: '14.29%', color: '#dc2626' },
];

export const robotStatData = [
  { label: '健康(HI>85)', count: 12, percentage: '28.57%', color: '#52c41a' },
  { label: '良好(60<HI≤85)', count: 12, percentage: '28.57%', color: '#faad14' },
  { label: '警告(40<HI≤60)', count: 12, percentage: '28.57%', color: '#fa8c16' },
  { label: '严重(HI≤40)', count: 6, percentage: '14.29%', color: '#ff4d4f' },
];

export const robotRiskData = [
  { rank: 1, name: '焊接机器人R07', location: '主线/侧围工位', score: 41.2, level: '警告', riskFactor: '轴抖动超标，报警频次过高' },
  { rank: 2, name: '搬运机器人B09', location: '地板线搬运', score: 48.9, level: '警告', riskFactor: '伺服电机过载，寿命临近' },
  { rank: 3, name: '点焊机器人R12', location: '地板线', score: 52.7, level: '警告', riskFactor: '轨迹偏移，焊点质量下降' },
  { rank: 4, name: '弧焊机器人A03', location: '侧围线', score: 55.3, level: '警告', riskFactor: '减速机油温异常' },
  { rank: 5, name: '焊接机器人R04', location: '主线', score: 58.6, level: '警告', riskFactor: '电流波动频繁' },
  { rank: 6, name: '搬运机器人R11', location: '总装过渡区', score: 61.2, level: '良好', riskFactor: '到位信号延迟' },
  { rank: 7, name: '点焊机器人R22', location: '侧围线补焊', score: 63.9, level: '良好', riskFactor: '电极臂磨损' },
  { rank: 8, name: '焊接机器人R18', location: '主线地板焊', score: 66.5, level: '良好', riskFactor: '伺服驱动扰动' },
  { rank: 9, name: '搬运机器人B03', location: '侧围线', score: 69, level: '良好', riskFactor: '编码器信号噪声' },
  { rank: 10, name: '焊接机器人R25', location: '地板补焊线', score: 72.1, level: '良好', riskFactor: '焊钳气缸压力不稳' },
];

export const servoPieData = [
  { name: '健康(HI>85)', value: 12, percentage: '27.27%', color: '#18a058' },
  { name: '良好(60<HI≤85)', value: 12, percentage: '27.27%', color: '#f59e0b' },
  { name: '警告(40<HI≤60)', value: 13, percentage: '29.55%', color: '#ea580c' },
  { name: '严重(HI≤40)', value: 7, percentage: '15.91%', color: '#dc2626' },
];

export const servoStatData = [
  { label: '健康(HI>85)', count: 12, percentage: '27.27%', color: '#52c41a' },
  { label: '良好(60<HI≤85)', count: 12, percentage: '27.27%', color: '#faad14' },
  { label: '警告(40<HI≤60)', count: 13, percentage: '29.55%', color: '#fa8c16' },
  { label: '严重(HI≤40)', count: 7, percentage: '15.91%', color: '#ff4d4f' },
];

export const servoRiskData = [
  { rank: 1, name: '主线转台伺服M07', location: '主线/转台', score: 42.1, level: '警告', riskFactor: '扭矩过载，负载率持续>95%' },
  { rank: 2, name: '升降机电机E02', location: '侧围升降机', score: 47.5, level: '警告', riskFactor: '电流不平衡，偏差12%' },
  { rank: 3, name: '输送变频驱动VFD3', location: '地板输送线', score: 51.3, level: '警告', riskFactor: 'IGBT过温预警' },
  { rank: 4, name: '侧围伺服轴S11', location: '侧围线精定位', score: 54.8, level: '警告', riskFactor: '编码器信号噪声' },
  { rank: 5, name: '主线辊床电机M09', location: '主线输送', score: 58.2, level: '警告', riskFactor: '轴承异响' },
  { rank: 6, name: '焊接转台伺服W02', location: '主线焊接转台', score: 62.5, level: '良好', riskFactor: '制动电阻过热' },
  { rank: 7, name: '升降伺服L05', location: '地板升降机', score: 65, level: '良好', riskFactor: '速度环波动' },
  { rank: 8, name: '涂胶伺服G01', location: '主线涂胶', score: 68.3, level: '良好', riskFactor: '扭矩波动7%' },
  { rank: 9, name: '侧围滑台伺服H08', location: '侧围滑台', score: 71.2, level: '良好', riskFactor: '位置偏差超差' },
  { rank: 10, name: '总装移载电机Y12', location: '总装过渡', score: 74.6, level: '良好', riskFactor: '散热风扇转速低' },
];

export const cylinderPieData = [
  { name: '健康(HI>85)', value: 15, percentage: '28.85%', color: '#18a058' },
  { name: '良好(60<HI≤85)', value: 15, percentage: '28.85%', color: '#f59e0b' },
  { name: '警告(40<HI≤60)', value: 14, percentage: '26.92%', color: '#ea580c' },
  { name: '严重(HI≤40)', value: 8, percentage: '15.38%', color: '#dc2626' },
];

export const cylinderStatData = [
  { label: '健康(HI>85)', count: 15, percentage: '28.85%', color: '#52c41a' },
  { label: '良好(60<HI≤85)', count: 15, percentage: '28.85%', color: '#faad14' },
  { label: '警告(40<HI≤60)', count: 14, percentage: '26.92%', color: '#fa8c16' },
  { label: '严重(HI≤40)', count: 8, percentage: '15.38%', color: '#ff4d4f' },
];

export const cylinderRiskData = [
  { rank: 1, name: '侧围夹具气缸C23', location: '侧围线/压紧工位', score: 38.5, level: '严重', riskFactor: '动作超时，到位信号丢失' },
  { rank: 2, name: '定位气缸C11', location: '地板线/定位', score: 44.2, level: '警告', riskFactor: '动作次数超寿命，变慢' },
  { rank: 3, name: '压紧气缸P04', location: '主线/压紧', score: 49.7, level: '警告', riskFactor: '到位时间延长0.4s' },
  { rank: 4, name: '夹紧气缸J07', location: '侧围线夹紧', score: 53.3, level: '警告', riskFactor: '密封圈磨损漏气' },
  { rank: 5, name: '定位气缸D12', location: '主线定位', score: 57.9, level: '警告', riskFactor: '磁性开关不稳定' },
  { rank: 6, name: '辅助压紧F02', location: '地板线', score: 61.4, level: '良好', riskFactor: '活塞杆偏磨增大' },
  { rank: 7, name: '侧围夹紧C11', location: '侧围线', score: 64.5, level: '良好', riskFactor: '活塞密封划伤' },
  { rank: 8, name: '主线夹紧M15', location: '主线焊接', score: 67.2, level: '良好', riskFactor: '缓冲器失效' },
  { rank: 9, name: '地板定位D09', location: '地板线', score: 70.3, level: '良好', riskFactor: '接近开关距离偏移' },
  { rank: 10, name: '侧围压紧C44', location: '侧围外板', score: 73, level: '良好', riskFactor: '气管接头松动' },
];

export const detailTableData = [
  { category: '机器人', name: '焊接机器人R07', location: '主线/侧围工位', score: 41.2, level: '健康', status: '健康', riskFactor: '轴抖动超标，报警频次过高' },
  { category: '机器人', name: '搬运机器人B09', location: '地板线搬运', score: 48.9, level: '健康', status: '健康', riskFactor: '伺服电机过载，寿命临近' },
  { category: '机器人', name: '点焊机器人R12', location: '地板线', score: 52.7, level: '健康', status: '健康', riskFactor: '轨迹偏移，焊点质量下降' },
  { category: '机器人', name: '弧焊机器人A03', location: '侧围线', score: 55.3, level: '警告', status: '警告', riskFactor: '减速机油温异常' },
  { category: '机器人', name: '焊接机器人R04', location: '主线', score: 58.6, level: '警告', status: '警告', riskFactor: '电流波动频繁' },
  { category: '机器人', name: '搬运机器人R11', location: '总装过渡区', score: 61.2, level: '良好', status: '良好', riskFactor: '到位信号延迟' },
  { category: '机器人', name: '点焊机器人R22', location: '侧围线补焊', score: 63.9, level: '良好', status: '良好', riskFactor: '电极臂磨损' },
  { category: '机器人', name: '焊接机器人R18', location: '主线地板焊', score: 66.5, level: '良好', status: '良好', riskFactor: '伺服驱动扰动' },
  { category: '机器人', name: '搬运机器人B03', location: '侧围线', score: 69, level: '良好', status: '良好', riskFactor: '编码器信号噪声' },
  { category: '机器人', name: '焊接机器人R25', location: '地板补焊线', score: 72.1, level: '良好', status: '良好', riskFactor: '焊钳气缸压力不稳' },
  { category: '伺服电机', name: '主线转台伺服M07', location: '主线/转台', score: 42.1, level: '警告', status: '警告', riskFactor: '扭矩过载，负载率持续>95%' },
  { category: '伺服电机', name: '升降机电机E02', location: '侧围升降机', score: 47.5, level: '警告', status: '警告', riskFactor: '电流不平衡，偏差12%' },
  { category: '伺服电机', name: '输送变频驱动VFD3', location: '地板输送线', score: 51.3, level: '警告', status: '警告', riskFactor: 'IGBT过温预警' },
  { category: '伺服电机', name: '侧围伺服轴S11', location: '侧围线精定位', score: 54.8, level: '警告', status: '警告', riskFactor: '编码器信号噪声' },
  { category: '伺服电机', name: '主线辊床电机M09', location: '主线输送', score: 58.2, level: '警告', status: '警告', riskFactor: '轴承异响' },
  { category: '伺服电机', name: '焊接转台伺服W02', location: '主线焊接转台', score: 62.5, level: '良好', status: '良好', riskFactor: '制动电阻过热' },
  { category: '伺服电机', name: '升降伺服L05', location: '地板升降机', score: 65, level: '良好', status: '良好', riskFactor: '速度环波动' },
  { category: '伺服电机', name: '涂胶伺服G01', location: '主线涂胶', score: 68.3, level: '良好', status: '良好', riskFactor: '扭矩波动7%' },
  { category: '伺服电机', name: '侧围滑台伺服H08', location: '侧围滑台', score: 71.2, level: '良好', status: '良好', riskFactor: '位置偏差超差' },
  { category: '伺服电机', name: '侧围滑台伺服H08', location: '侧围滑台', score: 71.2, level: '良好', status: '良好', riskFactor: '位置偏差超差' },
  { category: '伺服电机', name: '总装移载电机Y12', location: '总装过渡', score: 74.6, level: '良好', status: '良好', riskFactor: '散热风扇转速低' },
  { category: '夹具气缸', name: '侧围夹具气缸C23', location: '侧围线/压紧工位', score: 38.5, level: '严重', status: '严重', riskFactor: '动作超时，到位信号丢失' },
  { category: '夹具气缸', name: '侧围夹具气缸C23', location: '侧围线/压紧工位', score: 38.5, level: '严重', status: '严重', riskFactor: '动作超时，到位信号丢失' },
  { category: '夹具气缸', name: '定位气缸C11', location: '地板线/定位', score: 44.2, level: '健康', status: '警告', riskFactor: '动作次数超寿命，变慢' },
  { category: '夹具气缸', name: '压紧气缸P04', location: '主线/压紧', score: 49.7, level: '健康', status: '健康', riskFactor: '到位时间延长0.4s' },
  { category: '夹具气缸', name: '夹紧气缸J07', location: '侧围线夹紧', score: 53.3, level: '警告', status: '警告', riskFactor: '密封圈磨损漏气' },
  { category: '夹具气缸', name: '定位气缸D12', location: '主线定位', score: 57.9, level: '警告', status: '警告', riskFactor: '磁性开关不稳定' },
];
