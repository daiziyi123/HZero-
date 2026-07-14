import React from 'react';
import { RealTimeState } from '../data/detailMock';

interface StatusBadgesProps {
  state: RealTimeState;
}

const StatusBadges: React.FC<StatusBadgesProps> = ({ state }) => {
  const { runningReady, outputEnabled, brakeOpen, motorRotating, faultFlag } = state;
  const servOn = runningReady && outputEnabled && !faultFlag;

  const badges = [
    { led: servOn ? 'green' : 'red', label: `伺服ON: ${servOn ? '已使能' : '未使能'}` },
    { led: motorRotating ? 'green' : 'gray', label: `运行: ${motorRotating ? '运行中' : '停止'}` },
    { led: runningReady ? 'green' : 'gray', label: '运行就绪' },
    { led: outputEnabled ? 'green' : 'gray', label: '输出级使能' },
    { led: brakeOpen ? 'green' : 'gray', label: `制动器: ${brakeOpen ? '已打开' : '制动'}` },
    { led: !faultFlag ? 'green' : 'red', label: `故障: ${faultFlag ? '预警' : '正常'}` },
  ];

  return (
    <div className="sd-status-grid">
      {badges.map((b) => (
        <div key={b.label} className="sd-status-badge">
          <span className={`sd-led sd-led-${b.led}`} />
          {b.label}
        </div>
      ))}
    </div>
  );
};

export default StatusBadges;
