import { ParamTabType } from '../types';
import { cylinderTemplate, robotTemplate, servoTemplate } from '../data/mockData';

type XlsxModule = typeof import('xlsx');

async function loadXlsx(): Promise<XlsxModule> {
  return import('xlsx');
}

export async function parseExcelFile(file: File): Promise<string[][]> {
  const XLSX = await loadXlsx();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' }) as string[][];
}

export async function downloadTemplate(type: ParamTabType) {
  const XLSX = await loadXlsx();
  let sample: string[][];
  if (type === 'robot') {
    sample = robotTemplate;
  } else if (type === 'servo') {
    sample = servoTemplate;
  } else {
    sample = cylinderTemplate;
  }
  const ws = XLSX.utils.aoa_to_sheet(sample);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'template');
  XLSX.writeFile(wb, `${type}_template.xlsx`);
}

export async function exportVersionExcel(
  type: ParamTabType,
  versionNumber: string,
  deviceName: string,
  data: string[][],
  isRobot: boolean,
) {
  const XLSX = await loadXlsx();
  const sheetData = isRobot ? data : [['序号', '名称', '设置范围', '单位', '初始值', '当前值'], ...data];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${type}_params`);
  XLSX.writeFile(wb, `${type}_${versionNumber}_${deviceName}.xlsx`);
}
