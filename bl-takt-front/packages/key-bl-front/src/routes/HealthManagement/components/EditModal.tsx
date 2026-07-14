import React from 'react';
import { Modal, Button, Select } from 'choerodon-ui/pro';
import intl from 'utils/intl';

const { Option } = Select;

const categoryOptions = [
  { value: '状态类', label: '状态类' },
  { value: '性能类', label: '性能类' },
  { value: '质量类', label: '质量类' },
  { value: '寿命件类', label: '寿命件类' },
];
const modelPrompt = 'tarzan.healthManagement';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  editRecord: any;
}

const EditModal: React.FC<EditModalProps> = ({ visible, onClose, editRecord }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      title={intl.get(`${modelPrompt}.editModalTitle`).d('编辑指标')}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ border: '1px solid #d9d9d9', borderRadius: '4px', marginRight: '12px' }}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>,
        <Button key="submit" type="primary" onClick={onClose} style={{ borderRadius: '4px' }}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>,
      ]}
    >
      {editRecord && (
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {intl.get(`${modelPrompt}.indicatorName`).d('指标名称')}
            </label>
            <input
              type="text"
              defaultValue={editRecord?.get('indicatorName') || ''}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {intl.get(`${modelPrompt}.category`).d('类别')}
            </label>
            <Select
              style={{ width: '100%', height: '40px' }}
              defaultValue={editRecord?.get('category') || ''}
            >
              {categoryOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {intl.get(`${modelPrompt}.weight`).d('权重(%)')}
            </label>
            <input
              type="number"
              defaultValue={editRecord?.get('weight') ? editRecord.get('weight').replace('%', '') : ''}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {intl.get(`${modelPrompt}.formula`).d('计算公式/关键参数')}
            </label>
            <textarea
              defaultValue={editRecord?.get('formula') || ''}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              defaultChecked={editRecord?.get('enabled')}
              style={{ width: '16px', height: '16px', marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>
              {intl.get(`${modelPrompt}.enabled`).d('是否启用')}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditModal;