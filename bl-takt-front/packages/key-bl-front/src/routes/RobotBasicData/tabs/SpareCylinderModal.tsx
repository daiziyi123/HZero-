import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'hzero-ui';
import { Button, Select } from 'choerodon-ui/pro';
import { fetchLineLov, fetchWorkcellLov, fetchFixtureDeviceLov } from '../services';

const { Option } = Select;

interface SpareCylinderModalProps {
  visible: boolean;
  mode: 'detail' | 'edit' | 'add';
  record?: Record<string, any>;
  onClose: () => void;
  onSave?: (data: Record<string, any>) => void;
}

const SpareCylinderModal: React.FC<SpareCylinderModalProps> = ({
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
  const [optionsReady, setOptionsReady] = useState(false);

  // 联动切换追踪 ref（避免编辑回显时误清空已选值）
  const prevLineIdRef = useRef<string | undefined>(undefined);
  const prevWorkcellIdRef = useRef<string | undefined>(undefined);

  const buildEditFormData = (rec: Record<string, any>) => ({
    id: rec.id || null,
    _token: rec._token || undefined,  //乐观锁令牌
    objectVersionNumber: rec.objectVersionNumber || undefined,  // 乐观锁版本号
    equipmentCode: rec.equipmentCode || '',
    equipmentType: rec.equipmentType || '夹具气缸',
    fixtureCode: rec.fixtureCode || '',
    fixtureName: rec.fixtureName || '',
    groupNo: rec.groupNo || '',
    prodLineId: rec.prodLineId ? String(rec.prodLineId) : '',
    prodLineName: rec.prodLineName || '',
    workcellId: rec.workcellId ? String(rec.workcellId) : '',
    workcellName: rec.workcellName || '',
    equipmentId: rec.equipmentId ? String(rec.equipmentId) : '',
    equipmentName: rec.equipmentName || '',
    cylinderPurpose: rec.cylinderPurpose || '',
    cylinderBrand: rec.cylinderBrand || '',
    cylinderModel: rec.cylinderModel || '',
    lifeCount: rec.lifeCount || 0,
    actionCount: rec.actionCount || 0,
    solenoidValveCode: rec.solenoidValveCode || '',
    solenoidValveModel: rec.solenoidValveModel || '',
    cylinderUseDate: rec.cylinderUseDate ? rec.cylinderUseDate.slice(0, 10) : '',
    cylinderLifeYear: rec.cylinderLifeYear || 0,
    specDesc: rec.specDesc || '',
    specAngle: rec.specAngle || '',
    specMaxTorque: rec.specMaxTorque || '',
    specClampTorque: rec.specClampTorque || '',
    specBore: rec.specBore || '',
    specWeight: rec.specWeight || '',
    cylinderImageUrl: rec.cylinderImageUrl || '',
    valveImageUrl: rec.valveImageUrl || '',
  });

  const emptyFormData = {
    id: null,
    equipmentCode: '', equipmentType: '夹具气缸', fixtureCode: '', fixtureName: '',
    groupNo: '', prodLineId: '', prodLineName: '', workcellId: '', workcellName: '',
    equipmentId: '', cylinderPurpose: '', cylinderBrand: '', cylinderModel: '',
    lifeCount: 0, actionCount: 0, solenoidValveCode: '', solenoidValveModel: '',
    cylinderUseDate: '', cylinderLifeYear: 0, specDesc: '', specAngle: '',
    specMaxTorque: '', specClampTorque: '', specBore: '', specWeight: '',
    cylinderImageUrl: '', valveImageUrl: '',
  };

  // 弹窗打开时：编辑模式用 record 数据立即回显 + 预填充下拉选项；新增模式加载产线选项
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

      // 立即回显表单数据
      setFormData(buildEditFormData(record));

      // 用 record 自带名称预填充下拉选项，Select 可立即匹配显示文字
      if (prodLineId) {
        setLineOptions([{ value: prodLineId, label: prodLineName || prodLineId }]);
        if (workcellId) {
          setWorkcellOptions([{ value: workcellId, label: workcellName || workcellId }]);
          if (equipmentId) {
            setEquipmentOptions([{ value: equipmentId, label: equipmentName || equipmentId, code: record.equipmentCode || '' }]);
          }
        }
      }

      // 后台并行加载完整下拉选项
      Promise.all([
        // 产线全量选项
        fetchLineLov().then((res: any) => {
          if (res?.content) setLineOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }),
        // 工位全量选项
        prodLineId ? fetchWorkcellLov(prodLineId).then((res: any) => {
          if (res?.content) setWorkcellOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }) : Promise.resolve(),
        // 设备全量选项
        workcellId ? fetchFixtureDeviceLov(workcellId, 'EHM_FIXTURE_CYLINDER' /* 夹具气缸 */).then((res: any) => {
          if (res?.content) setEquipmentOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning, code: item.equipmentcode || '' })));
        }) : Promise.resolve(),
      ]).finally(() => {
        setOptionsReady(true);
        // 初始加载完成后记录产线/工位追踪 ref，确保后续用户切换时能正确清空联动值
        prevLineIdRef.current = prodLineId;
        prevWorkcellIdRef.current = workcellId;
      });
    } else {
      // 新增模式
      setFormData(emptyFormData);
      fetchLineLov()
        .then((res: any) => {
          if (res?.content) setLineOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        })
        .finally(() => setOptionsReady(true));
    }
  }, [visible]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .spare-cylinder-modal-wrap .ant-modal-content {
        border-radius: 16px !important;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 弹窗关闭/重新打开时重置联动追踪 ref
  useEffect(() => {
    if (!visible) {
      prevLineIdRef.current = undefined;
      prevWorkcellIdRef.current = undefined;
      setOptionsReady(false);
    }
  }, [visible]);

  // 产线变更时（用户手动切换），联动加载工位下拉数据
  useEffect(() => {
    if (!optionsReady) return; // 初始加载期间不触发联动
    const lineId = formData.prodLineId;
    if (lineId) {
      setWorkcellOptions([]);
      // 仅当产线真正变化（非初始回显）时清空工位/设备选中值及对应名称
      if (prevLineIdRef.current && prevLineIdRef.current !== lineId) {
        setFormData((prev) => ({
          ...prev,
          workcellId: '',
          workcellName: '',
          equipmentId: '',
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
      setFormData((prev) => ({ ...prev, workcellId: '' }));
      prevLineIdRef.current = undefined;
    }
  }, [formData.prodLineId]);

  // 工位变更时（用户手动切换），联动加载设备下拉数据
  useEffect(() => {
    if (!optionsReady) return; // 初始加载期间不触发联动
    const workcellId = formData.workcellId;
    if (workcellId) {
      setEquipmentOptions([]);
      // 仅当工位真正变化（非初始回显）时清空设备选中值及对应名称
      if (prevWorkcellIdRef.current && prevWorkcellIdRef.current !== workcellId) {
        setFormData((prev) => ({ ...prev, equipmentId: '', equipmentName: '' }));
      }
      prevWorkcellIdRef.current = workcellId;
      fetchFixtureDeviceLov(String(workcellId), 'EHM_FIXTURE_CYLINDER' /* 夹具气缸 */)
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

  const renderDateInput = (name: string) => (
    <input
      type="date"
      value={formData[name] || ''}
      disabled={isDetail}
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
      }}
    />
  );

  const title = mode === 'detail' ? '夹具气缸详情' : mode === 'edit' ? '编辑夹具气缸' : '新增夹具气缸';

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
      width={1200}
      closable
      bodyStyle={{ padding: 0 }}
      wrapClassName="spare-cylinder-modal-wrap"
    >
      <div style={{ padding: '24px', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
        {/* 气缸编号、气缸名称、设备类型 - 暂时隐藏，以后可能会用 */}
        {/* <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸编号')}
            {renderInput('cylinderCode', '气缸编号')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸名称')}
            {renderInput('cylinderName', '气缸名称')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('设备类型')}
            <input
              type="text"
              value={formData.equipmentType}
              disabled
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5',
                color: '#666666',
              }}
            />
          </div>
        </div> */}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('夹具编号')}
            {renderInput('fixtureCode', '夹具编号')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('夹具名称')}
            {renderInput('fixtureName', '夹具名称')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('组号')}
            {renderInput('groupNo', '组号')}
          </div>
        </div>

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
          <div style={{ flex: 1 }}>
            {renderLabel('设备')}
            {isDetail
              ? renderInput('equipmentName', '')
              : renderSelect('equipmentId', equipmentOptions, '选择设备')
            }
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸用途')}
            {renderInput('cylinderPurpose', '气缸用途')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸品牌')}
            {renderInput('cylinderBrand', '气缸品牌')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸型号')}
            {renderInput('cylinderModel', '气缸型号')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('寿命次数')}
            {renderInput('lifeCount', '0')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('已动作次数')}
            {renderInput('actionCount', '0')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('电磁阀编号')}
            {renderInput('solenoidValveCode', '电磁阀编号')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('电磁阀型号')}
            {renderInput('solenoidValveModel', '电磁阀型号')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸投入使用日期')}
            {renderDateInput('cylinderUseDate')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸累计使用年限(年)')}
            {renderInput('cylinderLifeYear', '0')}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#333333' }}>规格说明</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('规格说明')}
              {renderInput('specDesc', '规格说明')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('启角度')}
              {renderInput('specAngle', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('最大保持扭矩')}
              {renderInput('specMaxTorque', '')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('5bar夹紧力矩')}
              {renderInput('specClampTorque', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('缸径')}
              {renderInput('specBore', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('重量')}
              {renderInput('specWeight', '')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('气缸图片')}
            <div
              style={{
                width: '100%',
                height: '120px',
                border: '2px dashed #e0e0e0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
                cursor: isDetail ? 'default' : 'pointer',
              }}
            >
              {formData.cylinderImageUrl ? (
                <img src={formData.cylinderImageUrl} alt="气缸图片" style={{ maxHeight: '100%', maxWidth: '100%' }} />
              ) : (
                <span style={{ fontSize: '14px', color: '#999999' }}>暂无图片</span>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('电磁阀图片')}
            <div
              style={{
                width: '100%',
                height: '120px',
                border: '2px dashed #e0e0e0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
                cursor: isDetail ? 'default' : 'pointer',
              }}
            >
              {formData.valveImageUrl ? (
                <img src={formData.valveImageUrl} alt="电磁阀图片" style={{ maxHeight: '100%', maxWidth: '100%' }} />
              ) : (
                <span style={{ fontSize: '14px', color: '#999999' }}>暂无图片</span>
              )}
            </div>
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

export default SpareCylinderModal;