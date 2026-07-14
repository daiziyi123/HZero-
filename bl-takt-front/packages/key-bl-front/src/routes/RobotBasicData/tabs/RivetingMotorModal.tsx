import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'hzero-ui';
import { Button, Select } from 'choerodon-ui/pro';
import { getCurrentOrganizationId } from 'utils/utils';
import UploadButton from '@/components/newUpload/UploadButton';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import { fetchLineLov, fetchWorkcellLov, fetchFixtureDeviceLov } from '../services';

const { Option } = Select;

interface RivetingMotorModalProps {
  visible: boolean;
  mode: 'detail' | 'edit' | 'add';
  record?: Record<string, any>;
  onClose: () => void;
  onSave?: (data: Record<string, any>) => void;
}

const RivetingMotorModal: React.FC<RivetingMotorModalProps> = ({
  visible,
  mode,
  record = {},
  onClose,
  onSave,
}) => {
  const isDetail = mode === 'detail';
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<{ src: string; alt: string }[]>([]);
  const [lineOptions, setLineOptions] = useState<{ value: string; label: string }[]>([]);
  const [workcellOptions, setWorkcellOptions] = useState<{ value: string; label: string }[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<{ value: string; label: string; code?: string }[]>([]);
  const [optionsReady, setOptionsReady] = useState(false);
  const tenantId = getCurrentOrganizationId();

  // 联动切换追踪 ref（避免编辑回显时误清空已选值）
  const prevLineIdRef = useRef<string | undefined>(undefined);
  const prevWorkcellIdRef = useRef<string | undefined>(undefined);

  const handlePreview = (file: any) => {
    if (file.url) {
      setPreviewImages([{ src: file.url, alt: file.name || '' }]);
      setPreviewVisible(true);
    }
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
    setPreviewImages([]);
  };

  const buildEditFormData = (rec: Record<string, any>) => ({
    id: rec.id || null,
    _token: rec._token || undefined,  //乐观锁令牌
    objectVersionNumber: rec.objectVersionNumber || undefined,  // 乐观锁版本号
    prodLineId: rec.prodLineId ? String(rec.prodLineId) : '',
    prodLineName: rec.prodLineName || '',
    workcellId: rec.workcellId ? String(rec.workcellId) : '',
    workcellName: rec.workcellName || '',
    equipmentId: rec.equipmentId ? String(rec.equipmentId) : '',
    equipmentName: rec.equipmentName || '',
    controllerBrand: rec.controllerBrand || '',
    controllerModel: rec.controllerModel || '',
    controllerNpSupplyVoltage: rec.controllerNpSupplyVoltage || '',
    controllerNpInputFreq: rec.controllerNpInputFreq || '',
    controllerNpOutputFreq: rec.controllerNpOutputFreq || '',
    controllerNpRatedCurrent: rec.controllerNpRatedCurrent || '',
    controllerNpRecommendedPower: rec.controllerNpRecommendedPower || '',
    motorBrand: rec.motorBrand || '',
    motorModel: rec.motorModel || '',
    motorNpReducer: rec.motorNpReducer || '',
    motorNpBrake: rec.motorNpBrake || '',
    motorNpRatedPower: rec.motorNpRatedPower || '',
    motorNpRatedTorque: rec.motorNpRatedTorque || '',
    motorNpRatedSpeed: rec.motorNpRatedSpeed || '',
    motorNpRatedVoltage: rec.motorNpRatedVoltage || '',
    motorNpRatedCurrent: rec.motorNpRatedCurrent || '',
    motorNpRatedFreq: rec.motorNpRatedFreq || '',
    motorMfgDate: rec.motorMfgDate ? rec.motorMfgDate.slice(0, 10) : '',
    motorUseDate: rec.motorUseDate ? rec.motorUseDate.slice(0, 10) : '',
    motorLifeYear: rec.motorLifeYear || 0,
    motorImageKey: rec.motorImageKey || '',
    motorImageUrl: rec.motorImageUrl || '',
    cabinetImageKey: rec.cabinetImageKey || '',
    cabinetImageUrl: rec.cabinetImageUrl || '',
    tenantId: rec.tenantId || null,
    extJson: rec.extJson || null,
    paramThresholdWarningJson: rec.paramThresholdWarningJson || null,
  });

  const emptyFormData = {
    id: null, prodLineId: '', prodLineName: '', workcellId: '', workcellName: '',
    placeForStorage: '', controllerBrand: '', controllerModel: '',
    controllerNpSupplyVoltage: '', controllerNpInputFreq: '', controllerNpOutputFreq: '',
    controllerNpRatedCurrent: '', controllerNpRecommendedPower: '',
    motorBrand: '', motorModel: '', motorNpReducer: '', motorNpBrake: '',
    motorNpRatedPower: '', motorNpRatedTorque: '', motorNpRatedSpeed: '',
    motorNpRatedVoltage: '', motorNpRatedCurrent: '', motorNpRatedFreq: '',
    motorMfgDate: '', motorUseDate: '', motorLifeYear: 0,
    motorImageKey: '', motorImageUrl: '', cabinetImageKey: '', cabinetImageUrl: '',
    equipmentId: '', tenantId: null, extJson: null, paramThresholdWarningJson: null,
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
        fetchLineLov().then((res: any) => {
          if (res?.content) setLineOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }),
        prodLineId ? fetchWorkcellLov(prodLineId).then((res: any) => {
          if (res?.content) setWorkcellOptions(res.content.map((item: any) => ({ value: String(item.value), label: item.meaning })));
        }) : Promise.resolve(),
        workcellId ? fetchFixtureDeviceLov(workcellId, 'EHM_SERVO_MOTOR' /* 伺服电机 */).then((res: any) => {
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
      .riveting-motor-modal-wrap .ant-modal-content {
        border-radius: 16px !important;
        overflow: hidden;
      }
      .riveting-motor-modal-wrap .ant-upload.ant-upload-select-picture-card {
        width: 100%;
        height: 120px;
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
      fetchFixtureDeviceLov(String(workcellId), 'EHM_SERVO_MOTOR' /* 伺服电机 */)
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

  const title = mode === 'detail' ? '伺服电机详情' : mode === 'edit' ? '编辑伺服电机' : '新增伺服电机';

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

  const handleMotorImageUpload = (file: any, fileList: any[]) => {
    if (fileList && fileList.length > 0) {
      const lastFile = fileList[fileList.length - 1];
      setFormData({
        ...formData,
        motorImageUrl: lastFile.url || '',
        motorImageKey: lastFile.response || '',
      });
    }
  };

  const handleCabinetImageUpload = (file: any, fileList: any[]) => {
    if (fileList && fileList.length > 0) {
      const lastFile = fileList[fileList.length - 1];
      setFormData({
        ...formData,
        cabinetImageUrl: lastFile.url || '',
        cabinetImageKey: lastFile.response || '',
      });
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      closable
      bodyStyle={{ padding: 0 }}
      wrapClassName="riveting-motor-modal-wrap"
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
            {renderLabel('控制器品牌')}
            {renderInput('controllerBrand', '控制器品牌')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('电机品牌')}
            {renderInput('motorBrand', '电机品牌')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('电机出厂日期')}
            {renderDateInput('motorMfgDate')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('电机使用日期')}
            {renderDateInput('motorUseDate')}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('电机使用年限(年)')}
            {renderInput('motorLifeYear', '0')}
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
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#333333' }}>控制器铭牌</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('型号')}
              {renderInput('controllerModel', '型号')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('供电电压 [V]')}
              {renderInput('controllerNpSupplyVoltage', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('输入频率 [Hz]')}
              {renderInput('controllerNpInputFreq', '')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('输出频率 [Hz]')}
              {renderInput('controllerNpOutputFreq', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('额定输出电流')}
              {renderInput('controllerNpRatedCurrent', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('推荐电机功率 [kW]')}
              {renderInput('controllerNpRecommendedPower', '')}
            </div>
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
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#333333' }}>电机铭牌</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('型号')}
              {renderInput('motorModel', '型号')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('减速机')}
              {renderInput('motorNpReducer', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('制动器')}
              {renderInput('motorNpBrake', '')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('额定功率 [kW]')}
              {renderInput('motorNpRatedPower', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('额定转矩 [Nm]')}
              {renderInput('motorNpRatedTorque', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('额定转速 [rpm]')}
              {renderInput('motorNpRatedSpeed', '')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              {renderLabel('额定电压 [V]')}
              {renderInput('motorNpRatedVoltage', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('额定电流 [A]')}
              {renderInput('motorNpRatedCurrent', '')}
            </div>
            <div style={{ flex: 1 }}>
              {renderLabel('额定频率 [Hz]')}
              {renderInput('motorNpRatedFreq', '')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            {renderLabel('电机图片')}
            {formData.motorImageUrl ? (
              <div
                onClick={() => handlePreview({ url: formData.motorImageUrl, name: '电机图片' })}
                style={{
                  width: '100%',
                  height: '120px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={formData.motorImageUrl}
                  alt="电机图片"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                >
                  <span style={{ fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>👁</span>
                </div>
                {!isDetail && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, motorImageUrl: '', motorImageKey: '' });
                    }}
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f5222d',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ) : isDetail ? (
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                暂无图片
              </div>
            ) : (
              <UploadButton
                listType="picture-card"
                single
                bucketName="spfm-comp"
                tenantId={tenantId}
                fileList={[]}
                onUploadSuccess={handleMotorImageUpload}
                showUploadButton={!formData.motorImageUrl}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {renderLabel('控制柜图片')}
            {formData.cabinetImageUrl ? (
              <div
                onClick={() => handlePreview({ url: formData.cabinetImageUrl, name: '控制柜图片' })}
                style={{
                  width: '100%',
                  height: '120px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={formData.cabinetImageUrl}
                  alt="控制柜图片"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                >
                  <span style={{ fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>👁</span>
                </div>
                {!isDetail && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, cabinetImageUrl: '', cabinetImageKey: '' });
                    }}
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#f5222d',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ) : isDetail ? (
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                暂无图片
              </div>
            ) : (
              <UploadButton
                listType="picture-card"
                single
                bucketName="spfm-comp"
                tenantId={tenantId}
                fileList={[]}
                onUploadSuccess={handleCabinetImageUpload}
                showUploadButton={!formData.cabinetImageUrl}
              />
            )}
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

      <Viewer
        visible={previewVisible}
        onClose={handlePreviewCancel}
        images={previewImages}
        zIndex={9999}
      />
    </Modal>
  );
};

export default RivetingMotorModal;
