import { HealthStatus } from './types';

/** 与设计稿 HI 分级一致：健康>85，良好60-85，警告40-60，严重<40 */
export const hiToHealthKey = (hi: number): string => {
  if (hi > 85) return 'health';
  if (hi >= 60) return 'good';
  if (hi >= 40) return 'warning';
  return 'critical';
};

export const healthKeyToStatus = (key: string): HealthStatus => {
  const map: Record<string, HealthStatus> = {
    health: '健康',
    good: '良好',
    warning: '警告',
    critical: '严重',
  };
  return map[key] || '良好';
};

export const resolveStatusFromHi = (hi: number): HealthStatus =>
  healthKeyToStatus(hiToHealthKey(hi));

export const getScoreColor = (status: HealthStatus | string): string => {
  const colorMap: Record<string, string> = {
    健康: '#18a058',
    良好: '#f59e0b',
    警告: '#ea580c',
    严重: '#dc2626',
  };
  return colorMap[status] || colorMap['良好'];
};

export const getStatusStyle = (status: HealthStatus | string): { bgColor: string; textColor: string } => {
  const styles: Record<string, { bgColor: string; textColor: string }> = {
    健康: { bgColor: '#dcfce7', textColor: '#18a058' },
    良好: { bgColor: '#fef3c7', textColor: '#f59e0b' },
    警告: { bgColor: '#fed7aa', textColor: '#ea580c' },
    严重: { bgColor: '#fee2e2', textColor: '#dc2626' },
  };
  return styles[status] || styles['良好'];
};

export const getLifeRateColor = (rate: number): string => {
  if (rate >= 80) return '#18a058';
  if (rate >= 50) return '#f59e0b';
  return '#ea580c';
};
