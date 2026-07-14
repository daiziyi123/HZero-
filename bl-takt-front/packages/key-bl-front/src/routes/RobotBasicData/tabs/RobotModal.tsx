import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'hzero-ui';
import { Button, Select } from 'choerodon-ui/pro';
import { fetchLineLov, fetchWorkcellLov, fetchFixtureDeviceLov } from '../services';

const { Option } = Select;

interface RobotModalProps {
  visible: boolean;
  mode: 'detail' | 'edit' | 'add';
  record?: Record<string, any>;
  onClose: () => void;
  onSave?: (data: Record<string, any>) => void;
}

const RobotModal: React.FC<RobotModalProps> = ({
  visible,
  mode,
  record = {},
  onClose,
  onSave,
}) => {
  const isDetail = mode === 'detail';
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [lineOptions, setLineOptions] = useState<{ value: string; label: string }[]>([]);
  const [workcellOptions, setWorkcellOptions] = useState<{ value: string; label: string }[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<{ value: string; label: string; code?: string }[]>([]);
  const [equipmentTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ROBOT_ARM', label: '机械臂' },
    { value: 'AGV', label: 'AGV小车' },
    { value: 'SCARA', label: 'SCARA机器人' },
    { value: 'DELTA', label: 'DELTA机器人' },
    { value: 'OTHER', label: '其他' },
  ]);
  const [optionsReady, setOptionsReady] = useState(false);

  const prevLineIdRef = useRef<string | undefined>(undefined);
  const prevWorkcellIdRef = useRef<string | undefined>(undefined);

  const buildEditFormData = (rec: Record<string, any>) => ({
    id: rec.id || null,
    _token: rec._token || undefined,
    objectVersionNumber: rec.objectVersionNumber || undefined,
    prodLineId: rec.prodLineId ? String(rec.prodLineId) : '',
    prodLineName: rec.prodLineName || '',
    workcellId: rec.workcellId ? String(rec.workcellId) : '',
    workcellName: rec.workcellName || '',
    equipmentId: rec.equipmentId ? String(rec.equipmentId) : '',
    equipmentCode: rec.equipmentCode || '',
    equipmentName: rec.equipmentName || '',
    equipmentType: rec.equipmentType || '',
    equipmentTypeName: rec.equipmentTypeName || '',
    tenantId: rec.tenantId || null,
  });

  const emptyFormData = {
    id: null,
    prodLineId: '',
    prodLineName: '',
    workcellId: '',
    workcellName: '',
    equipmentId: '',
    equipmentCode: '',
    equipmentName: '',
    equipmentType: '',
    equipmentTypeName: '',
    tenantId: null,
  };

  useEffect(() => {
    if (!visible) return;

    setOptionsReady(false);
    setLineOptions([]);
    setWorkcellOptions([]);
    setEquipmentOptions([]);

    const isEdit = record && record.id;

    if (isEdit) {
      const prodLineId = record.prodLineId ? String(record.prodLineId) : '';
      const prodLineName = record.prodLineName || '';
      const workcellId = record.workcellId ? String(record.workcellId) : '';
      const workcellName = record.workcellName || '';
      const equipmentId = record.equipmentId ? String(record.equipmentId) : '';
      const equipmentName = record.equipmentName || '';

      setFormData(buildEditFormData(record));

      if (prodLineId) {
        setLineOptions([{ value: prodLineId, label: prodLineName || prodLineId }]);
        if (workcellId) {
          setWorkcellOptions([{ value: workcellId, label: workcellName || workcellId }]);
          if (equipmentId) {
            setEquipmentOptions([{ value: equipmentId, label: equipmentName || equipmentId, code: record.equipmentCode || '' }]);
          }
        }
      }

      Promise.all([
        fetchLineLov().then((res: any) => {
          if (res?.content) setLineOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }),
        prodLineId ? fetchWorkcellLov(prodLineId).then((res: any) => {
          if (res?.content) setWorkcellOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }) : Promise.resolve(),
        workcellId ? fetchFixtureDeviceLov(workcellId, 'EHM_ROBOT' /* 机器人 */).then((res: any) => {
          if (res?.content) setEquipmentOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning, code: item.equipmentcode || '' })));
        }) : Promise.resolve(),
      ]).finally(() => {
        setOptionsReady(true);
        prevLineIdRef.current = prodLineId;
        prevWorkcellIdRef.current = workcellId;
      });
    } else {
      setFormData(emptyFormData);
      fetchLineLov()
        .then((res: any) => {
          if (res?.content) setLineOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        })
        .finally(() => setOptionsReady(true));
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      prevLineIdRef.current = undefined;
      prevWorkcellIdRef.current = undefined;
      setOptionsReady(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!optionsReady) return;
    const lineId = formData.prodLineId;
    if (lineId) {
      setWorkcellOptions([]);
      setEquipmentOptions([]);
      if (prevLineIdRef.current && prevLineIdRef.current !== lineId) {
        setFormData((prev) => ({
          ...prev,
          workcellId: '',
          workcellName: '',
          equipmentId: '',
          equipmentCode: '',
          equipmentName: '',
        }));
      }
      prevLineIdRef.current = lineId;
      fetchWorkcellLov(String(lineId))
        .then((res: any) => {
          if (res && res.content) {
            setWorkcellOptions(
              res.content.map((item: any) => ({
                value: String(item.value),
                label: item.meaning,
              }))
            );
          }
        })
        .catch((err: any) => {
          console.error('获取工位下拉数据失败:', err);
        });
    } else {
      setWorkcellOptions([]);
      setEquipmentOptions([]);
      setFormData((prev) => ({ ...prev, workcellId: '', equipmentId: '' }));
      prevLineIdRef.current = undefined;
    }
  }, [formData.prodLineId]);

  useEffect(() => {
    if (!optionsReady) return;
    const workcellId = formData.workcellId;
    if (workcellId) {
      setEquipmentOptions([]);
      if (prevWorkcellIdRef.current && prevWorkcellIdRef.current !== workcellId) {
        setFormData((prev) => ({ ...prev, equipmentId: '', equipmentCode: '', equipmentName: '' }));
      }
      prevWorkcellIdRef.current = workcellId;
      fetchFixtureDeviceLov(String(workcellId), 'EHM_ROBOT' /* 机器人 */)
        .then((res: any) => {
          if (res && res.content) {
            setEquipmentOptions(
              res.content.map((item: any) => ({
                value: String(item.value),
                label: item.meaning,
                code: item.equipmentcode || '',
              }))
            );
          }
        })
        .catch((err: any) => {
          console.error('获取设备下拉数据失败:', err);
        });
    } else {
      setEquipmentOptions([]);
      setFormData((prev) => ({ ...prev, equipmentId: '' }));
      prevWorkcellIdRef.current = undefined;
    }
  }, [formData.workcellId]);

  const title = mode === 'detail' ? '机器人设备详情' : mode === 'edit' ? '编辑机器人设备' : '新增机器人设备';

  const renderLabel = (text: string) => (
    <span style={{ fontSize: '14px', color: '#666666', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
      {text}
    </span>
  );

  const renderInput = (name: string, placeholder = '') => (
    <input
      type="text"
      value={formData[name] || ''}
      disabled={isDetail}
      placeholder={placeholder}
      onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
      style={{
        width: '100%',
        height: '32px',
        padding: '0 12px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box',
        backgroundColor: isDetail ? '#fafafa' : '#ffffff',
        color: isDetail ? '#999999' : '#333333',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    />
  );

  const nameMap: Record<string, string> = {
    prodLineId: 'prodLineName',
    workcellId: 'workcellName',
    equipmentId: 'equipmentName',
    equipmentType: 'equipmentTypeName',
  };

  const renderSelect = (name: string, options: { value: string; label: string; code?: string }[], placeholder = '') => (
    <Select
      disabled={isDetail}
      value={formData[name] || undefined}
      onChange={(value) => {
        const option = value ? options.find((opt) => opt.value === value) : null;
        const label = option?.label || '';
        const code = option?.code || '';
        const updates: Record<string, any> = {
          [name]: value,
          ...(nameMap[name] ? { [nameMap[name]]: label } : {}),
        };
        if (name === 'equipmentId') {
          updates.equipmentCode = code;
        }
        setFormData({
          ...formData,
          ...updates,
        });
      }}
      style={{ width: '100%', height: '32px', borderRadius: '8px' }}
      placeholder={placeholder}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      closable
      bodyStyle={{ padding: 0 }}
      wrapClassName="robot-modal-wrap"
    >
      <div style={{ padding: '24px', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('产线')}
            {isDetail
              ? renderInput('prodLineName', '')
              : renderSelect('prodLineId', lineOptions, '选择产线')
            }
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('工位')}
            {isDetail
              ? renderInput('workcellName', '')
              : renderSelect('workcellId', workcellOptions, '选择工位')
            }
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('设备')}
            {isDetail
              ? renderInput('equipmentName', '')
              : renderSelect('equipmentId', equipmentOptions, '选择设备')
            }
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('设备类型')}
            {isDetail
              ? renderInput('equipmentTypeName', '')
              : renderSelect('equipmentType', equipmentTypeOptions, '选择设备类型')
            }
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <Button
          onClick={onClose}
          style={{
            height: '40px',
            padding: '0 32px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666666',
            backgroundColor: '#ffffff',
          }}
        >
          关闭
        </Button>
        {!isDetail && (
          <Button
            type="primary"
            onClick={() => onSave?.(formData)}
            style={{
              height: '40px',
              padding: '0 32px',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#3b82f6',
              borderColor: '#3b82f6',
            }}
          >
            保存
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default RobotModal;