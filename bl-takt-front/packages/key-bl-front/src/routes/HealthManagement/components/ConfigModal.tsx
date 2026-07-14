import React from 'react';
import { Modal, Button } from 'choerodon-ui/pro';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.healthManagement';

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
  activeTab: string;
  plannedTime: string;
  setPlannedTime: (value: string) => void;
  alarmBase: string;
  setAlarmBase: (value: string) => void;
  ratedValue: string;
  setRatedValue: (value: string) => void;
  waveFullUpper: string;
  setWaveFullUpper: (value: string) => void;
  waveMiddleUpper: string;
  setWaveMiddleUpper: (value: string) => void;
  alarmFullCount: string;
  setAlarmFullCount: (value: string) => void;
  alarmMiddleUpperCount: string;
  setAlarmMiddleUpperCount: (value: string) => void;
  lifeFullThreshold: string;
  setLifeFullThreshold: (value: string) => void;
  lifeMiddleLower: string;
  setLifeMiddleLower: (value: string) => void;
  lifeMiddleUpper: string;
  setLifeMiddleUpper: (value: string) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  visible,
  onClose,
  activeTab,
  plannedTime,
  setPlannedTime,
  alarmBase,
  setAlarmBase,
  ratedValue,
  setRatedValue,
  waveFullUpper,
  setWaveFullUpper,
  waveMiddleUpper,
  setWaveMiddleUpper,
  alarmFullCount,
  setAlarmFullCount,
  alarmMiddleUpperCount,
  setAlarmMiddleUpperCount,
  lifeFullThreshold,
  setLifeFullThreshold,
  lifeMiddleLower,
  setLifeMiddleLower,
  lifeMiddleUpper,
  setLifeMiddleUpper,
}) => {
  const handleSave = () => {
    console.log('保存配置:', { activeTab });
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      title={intl.get(`${modelPrompt}.configModalTitle`).d('参数配置')}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', marginRight: '12px' }}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave} style={{ borderRadius: '4px' }}>
          {intl.get(`${modelPrompt}.saveConfig`).d('保存配置')}
        </Button>,
      ]}
      width={500}
    >
      <div style={{ padding: '16px' }}>
        {activeTab === 'robot' && (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '140px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
                {intl.get(`${modelPrompt}.plannedTime`).d('计划生产时间')}
                <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                <span style={{ color: '#999', fontWeight: 'normal', marginLeft: '4px' }}>(小时)</span>
              </label>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="number"
                  value={plannedTime}
                  onChange={(e) => setPlannedTime(e.target.value)}
                  min="1"
                  max="24"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 40px 0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '14px' }}>小时</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '140px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
                {intl.get(`${modelPrompt}.alarmBase`).d('报警基数')}
                <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
              </label>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="number"
                  value={alarmBase}
                  onChange={(e) => setAlarmBase(e.target.value)}
                  min="1"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 30px 0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '14px' }}>次</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'servo' && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ width: '80px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
              {intl.get(`${modelPrompt}.ratedValue`).d('额定值')}
            </label>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={ratedValue}
                onChange={(e) => setRatedValue(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'cylinder' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>波动满分上限%</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={waveFullUpper}
                  onChange={(e) => setWaveFullUpper(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '14px' }}>%</span>
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>波动中间上限%</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={waveMiddleUpper}
                  onChange={(e) => setWaveMiddleUpper(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '14px' }}>%</span>
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>报警满分次数</label>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={alarmFullCount}
                  onChange={(e) => setAlarmFullCount(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>报警中间上限次数</label>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={alarmMiddleUpperCount}
                  onChange={(e) => setAlarmMiddleUpperCount(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>剩余寿命满分阈值%</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={lifeFullThreshold}
                  onChange={(e) => setLifeFullThreshold(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '14px' }}>%</span>
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>剩余寿命中间下限%</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={lifeMiddleLower}
                  onChange={(e) => setLifeMiddleLower(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '14px' }}>%</span>
              </div>
            </div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '180px', fontSize: '14px', color: '#666' }}>剩余寿命中间上限%</label>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={lifeMiddleUpper}
                  onChange={(e) => setLifeMiddleUpper(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ marginLeft: '8px', color: '#999', fontSize: '14px' }}>%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfigModal;