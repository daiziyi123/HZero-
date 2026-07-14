import React from 'react';
import { Icon } from 'choerodon-ui';
import {
  getLevel,
  NameplateInfo,
  RealTimeState,
  ThresholdConfig,
  WarningLevel,
} from '../data/detailMock';

interface NameplatePanelProps {
  nameplate: NameplateInfo;
  state: RealTimeState;
  thresholds: ThresholdConfig;
}

const levelClass = (level: WarningLevel): string => {
  if (level === '正常') return '';
  if (level === '轻度') return 'sd-param-mild';
  if (level === '中度') return 'sd-param-moderate';
  return 'sd-param-severe';
};

const NameplatePanel: React.FC<NameplatePanelProps> = ({ nameplate, state, thresholds }) => {
  const tl = getLevel(state.actualTorque, thresholds.torque);
  const sl = getLevel(state.actualSpeed, thresholds.speed);
  const pl = getLevel(state.actualPosition, thresholds.position);

  const paramBlocks = [
    { label: '反馈速度 (rpm)', value: String(state.actualSpeed), level: sl },
    { label: '反馈位置 (mm)', value: state.actualPosition.toFixed(1), level: pl },
    { label: '当前转矩/推力 (Nm)', value: state.actualTorque.toFixed(1), level: tl },
    { label: '是否故障', value: state.faultFlag ? '是' : '否', level: '正常' as WarningLevel },
    { label: '制动器已打开', value: state.brakeOpen ? '已打开' : '闭合', level: '正常' as WarningLevel },
  ];

  return (
    <div className="sd-nameplate-row">
      <div className="sd-realtime-col">
        <div className="sd-section-label">
          <Icon type="speed" className="sd-section-icon" />
          实时运行参数
        </div>
        <div className="sd-param-grid">
          {paramBlocks.map((p) => (
            <div
              key={p.label}
              className={`sd-param-block${p.level !== '正常' ? ` sd-param-warn ${levelClass(p.level)}` : ''}`}
            >
              <div className="sd-param-label">{p.label}</div>
              <div className="sd-param-value">{p.value}</div>
              {p.level !== '正常' && (p.label.includes('反馈') || p.label.includes('转矩')) ? (
                <div className="sd-param-sub">{p.level}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="sd-nameplate-box">
        <div className="sd-section-label">
          <Icon type="label" className="sd-section-icon" />
          控制器铭牌
        </div>
        <div className="sd-info-row">
          {nameplate.controller.map((item) => (
            <div key={item.label} className="sd-info-item">
              <span className="sd-info-label">{item.label}：</span>
              <span className="sd-info-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sd-nameplate-box">
        <div className="sd-section-label">
          <Icon type="settings" className="sd-section-icon" />
          电机铭牌
        </div>
        <div className="sd-info-row">
          {nameplate.motor.map((item) => (
            <div key={item.label} className="sd-info-item">
              <span className="sd-info-label">{item.label}：</span>
              <span className="sd-info-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NameplatePanel;
