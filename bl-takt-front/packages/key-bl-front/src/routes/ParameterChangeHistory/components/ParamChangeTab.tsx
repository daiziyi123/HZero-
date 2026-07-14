/*
 * @Description: 参数变更履历 Tab 内容（版本表 + 参数对比表）
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Modal, TextField, Tooltip } from 'choerodon-ui/pro';
import { Icon, message } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import DeviceSelector from './DeviceSelector';
import { downloadTemplate, exportVersionExcel, parseExcelFile } from '../utils/excelHelper';
import { DeviceMap, DeviceSelection, ParamTabType, ParamVersion } from '../types';

export interface ParamChangeTabProps {
  type: ParamTabType;
  deviceMap: DeviceMap;
  initialVersions: ParamVersion[];
  initialCurrentId: number;
}

interface PagerState {
  versionPage: number;
  versionSize: number;
  paramPage: number;
  paramSize: number;
  filter: string;
}

const SERVO_HEADERS = ['序号', '名称', '设置范围', '单位', '初始值', '当前值'];

const ParamChangeTab: React.FC<ParamChangeTabProps> = observer((props) => {
  const { type, deviceMap, initialVersions, initialCurrentId } = props;
  const isRobot = type === 'robot';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [versions, setVersions] = useState<ParamVersion[]>(initialVersions);
  const [currentId, setCurrentId] = useState<number>(initialCurrentId);
  const [deviceSelection, setDeviceSelection] = useState<DeviceSelection | null>(null);
  const [pager, setPager] = useState<PagerState>({
    versionPage: 1,
    versionSize: 5,
    paramPage: 1,
    paramSize: 5,
    filter: '',
  });

  const currentVersion = useMemo(
    () => versions.find((v) => v.id === currentId),
    [versions, currentId],
  );

  const currentIndex = useMemo(
    () => versions.findIndex((v) => v.id === currentId),
    [versions, currentId],
  );

  const prevVersion = currentIndex > 0 ? versions[currentIndex - 1] : null;

  const versionPageData = useMemo(() => {
    const start = (pager.versionPage - 1) * pager.versionSize;
    return versions.slice(start, start + pager.versionSize);
  }, [versions, pager.versionPage, pager.versionSize]);

  const versionTotalPages = Math.max(1, Math.ceil(versions.length / pager.versionSize));

  const paramRows = useMemo(() => {
    if (!currentVersion) return [];
    const data = currentVersion.data;
    const filterVal = pager.filter.toLowerCase();

    if (isRobot) {
      const rows: { row: string[]; rowIdx: number }[] = [];
      for (let i = 1; i < data.length; i += 1) {
        rows.push({ row: data[i], rowIdx: i });
      }
      return rows.filter((r) => r.row[0]?.toString().toLowerCase().includes(filterVal));
    }

    return data
      .map((row, idx) => ({ row, rowIdx: idx }))
      .filter((r) => r.row[1]?.toString().toLowerCase().includes(filterVal));
  }, [currentVersion, pager.filter, isRobot]);

  const paramPageData = useMemo(() => {
    const start = (pager.paramPage - 1) * pager.paramSize;
    return paramRows.slice(start, start + pager.paramSize);
  }, [paramRows, pager.paramPage, pager.paramSize]);

  const paramTotalPages = Math.max(1, Math.ceil(paramRows.length / pager.paramSize));

  const paramHeaders = useMemo(() => {
    if (!currentVersion) return isRobot ? [] : SERVO_HEADERS;
    return isRobot ? currentVersion.data[0] || [] : SERVO_HEADERS;
  }, [currentVersion, isRobot]);

  const genVersionNum = useCallback(
    () => `v${versions.length + 1}.0`,
    [versions.length],
  );

  const handleImportClick = () => {
    if (!deviceSelection) {
      message.warning('请先选择产线、工位和设备');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !deviceSelection) return;

    try {
      const json = await parseExcelFile(file);
      if (!json || json.length < 2) {
        message.error('模板至少包含标题行和数据行');
        return;
      }

      const changeDescRef = { current: '导入新版本参数' };
      Modal.open({
        title: '变更说明',
        children: (
          <TextField
            placeholder="请输入变更说明"
            defaultValue="导入新版本参数"
            onChange={(val) => {
              changeDescRef.current = val || '';
            }}
          />
        ),
        onOk: () => {
          const changeDesc = changeDescRef.current || '导入新版本参数';
          const newVersion: ParamVersion = {
            id: Date.now(),
            line: deviceSelection.line,
            station: deviceSelection.station,
            deviceName: deviceSelection.device,
            fileName: file.name,
            versionNumber: genVersionNum(),
            changeDesc,
            importTime: new Date().toLocaleString('zh-CN'),
            data: isRobot ? json : json.slice(1),
            headers: isRobot ? json[0] : undefined,
          };
          setVersions((prev) => [...prev, newVersion]);
          setCurrentId(newVersion.id);
          setPager((p) => ({ ...p, versionPage: Math.ceil((versions.length + 1) / p.versionSize) }));
          message.success('导入成功');
        },
      });
    } catch {
      message.error('文件解析失败，请检查 Excel 格式');
    } finally {
      e.target.value = '';
    }
  };

  const handleExport = async () => {
    if (!currentVersion) {
      message.warning('无数据可导出');
      return;
    }
    await exportVersionExcel(
      type,
      currentVersion.versionNumber,
      currentVersion.deviceName,
      currentVersion.data,
      isRobot,
    );
  };

  const handleDownloadTemplate = async () => {
    await downloadTemplate(type);
  };

  const handleEditDesc = (version: ParamVersion) => {
    const descRef = { current: version.changeDesc };
    Modal.open({
      title: '编辑变更说明',
      children: (
        <TextField
          defaultValue={version.changeDesc}
          onChange={(val) => {
            descRef.current = val || '';
          }}
        />
      ),
      onOk: () => {
        setVersions((prev) =>
          prev.map((v) => (v.id === version.id ? { ...v, changeDesc: descRef.current } : v)),
        );
      },
    });
  };

  const renderDiffBadge = (prevVal: string, currVal: string) => (
    <Tooltip title={`上次值: ${prevVal}  →  本次值: ${currVal}`}>
      <span className="pch-diff-badge">●</span>
    </Tooltip>
  );

  const renderPagination = (
    page: number,
    totalPages: number,
    pageSize: number,
    onPageChange: (delta: number) => void,
    onSizeChange: (size: number) => void,
  ) => (
    <div className="pch-pagination">
      <span>每页</span>
      <select
        value={pageSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
      >
        
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      <span>条</span>
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(-1)}>
        上一页
      </button>
      <span>
        第 {page} / {totalPages} 页
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(1)}>
        下一页
      </button>
    </div>
  );

  return (
    <div className="pch-tab-pane">
      <div className="pch-version-section">
        <div className="pch-toolbar">
          <DeviceSelector deviceMap={deviceMap} onChange={setDeviceSelection} />
          <div className="pch-toolbar-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button className="pch-btn-primary" onClick={handleImportClick}>
              <Icon type="file_upload" />
              导入Excel
            </Button>
            <Button className="pch-btn-outline" onClick={handleDownloadTemplate}>
              <Icon type="file_download" />
              下载模板
            </Button>
            <Button className="pch-btn-outline" onClick={handleExport}>
              <Icon type="description" />
              导出Excel
            </Button>
          </div>
        </div>

        <div className="pch-table-wrapper pch-table-wrapper--rows-3">
          <table className="pch-table pch-version-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>设备信息</th>
                <th>文件名称</th>
                <th>版本号</th>
                <th>变更说明</th>
                <th>导入时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {versionPageData.map((v, idx) => {
                const rowNum = (pager.versionPage - 1) * pager.versionSize + idx + 1;
                return (
                  <tr
                    key={v.id}
                    className={currentId === v.id ? 'pch-row-selected' : ''}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      setCurrentId(v.id);
                      setPager((p) => ({ ...p, paramPage: 1 }));
                    }}
                  >
                    <td>{rowNum}</td>
                    <td>{`${v.line}/${v.station}/${v.deviceName}`}</td>
                    <td>{v.fileName}</td>
                    <td>{v.versionNumber}</td>
                    <td>{v.changeDesc}</td>
                    <td>{v.importTime}</td>
                    <td>
                      <Button
                        className="pch-btn-outline pch-btn-sm"
                        onClick={() => handleEditDesc(v)}
                      >
                        编辑
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {renderPagination(
          pager.versionPage,
          versionTotalPages,
          pager.versionSize,
          (delta) =>
            setPager((p) => ({
              ...p,
              versionPage: Math.min(Math.max(1, p.versionPage + delta), versionTotalPages),
            })),
          (size) => setPager((p) => ({ ...p, versionPage: 1, versionSize: size })),
        )}
      </div>

      <div className="pch-param-section">
        <div className="pch-search-box">
          <Icon type="search" />
          <input
            type="text"
            placeholder="按参数名称过滤"
            value={pager.filter}
            onChange={(e) =>
              setPager((p) => ({ ...p, filter: e.target.value, paramPage: 1 }))
            }
          />
        </div>

        <div className="pch-table-wrapper pch-table-wrapper--rows-3">
          <table className="pch-table pch-param-table">
            <thead>
              <tr>
                {paramHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!currentVersion ? (
                <tr>
                  <td colSpan={paramHeaders.length || 6}>请选择或导入版本</td>
                </tr>
              ) : (
                paramPageData.map(({ row, rowIdx }) => (
                  <tr key={`${rowIdx}-${row[0]}`}>
                    {row.map((cell, j) => {
                      let showDiff = false;
                      let prevVal = '';
                      if (prevVersion) {
                        if (isRobot && prevVersion.data[rowIdx]?.[j] !== cell) {
                          showDiff = true;
                          prevVal = prevVersion.data[rowIdx]?.[j] ?? '';
                        } else if (!isRobot && j === 5 && prevVersion.data[rowIdx]?.[5] !== cell) {
                          showDiff = true;
                          prevVal = prevVersion.data[rowIdx]?.[5] ?? '';
                        }
                      }
                      return (
                        <td key={`${rowIdx}-${j}`}>
                          {cell}
                          {showDiff && renderDiffBadge(prevVal, cell)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderPagination(
          pager.paramPage,
          paramTotalPages,
          pager.paramSize,
          (delta) =>
            setPager((p) => ({
              ...p,
              paramPage: Math.min(Math.max(1, p.paramPage + delta), paramTotalPages),
            })),
          (size) => setPager((p) => ({ ...p, paramPage: 1, paramSize: size })),
        )}
      </div>
    </div>
  );
});

export default ParamChangeTab;
