import * as XLSX from 'xlsx';
import { CohortLearner } from '../types/induction';

/**
 * Calculates optimal column widths based on content lengths
 */
function calculateColumnWidths(data: (string | number | undefined | null)[][]): { wch: number }[] {
  if (!data || data.length === 0) return [];
  const colCount = data[0].length;
  const colWidths: number[] = new Array(colCount).fill(10);

  for (const row of data) {
    for (let colIdx = 0; colIdx < colCount; colIdx++) {
      const val = row[colIdx];
      const strVal = val !== undefined && val !== null ? String(val) : '';
      if (strVal.length + 3 > colWidths[colIdx]) {
        colWidths[colIdx] = Math.min(strVal.length + 3, 50); // cap max width at 50
      }
    }
  }

  return colWidths.map((w) => ({ wch: Math.max(w, 12) }));
}

/**
 * Creates a complete Excel workbook (.xlsx) with 3 organized sheets:
 * 1. Caracterización
 * 2. Progreso Módulos
 * 3. Evaluación
 */
export function createCohortWorkbook(ficha: string, learners: CohortLearner[]): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // --- SHEET 1: CARACTERIZACIÓN ---
  const caracHeaders = [
    'Documento',
    'Tipo Doc',
    'Nombre Completo',
    'Correo Institucional',
    'Teléfono',
    'Ciudad / Municipio',
    'Dirección de Residencia',
    'Género',
    'Tipo de Población',
    'Ficha',
    'Programa de Formación',
    'Regional',
    'Centro de Formación',
    'Estado Inducción'
  ];

  const caracRows = learners.map((l) => [
    l.documentNumber,
    l.documentType || 'CC',
    l.fullName,
    l.email,
    l.phone || 'No registrado',
    l.city || 'No registrada',
    l.address || 'No registrada',
    l.gender || 'No especificado',
    l.populationType || 'General',
    l.ficha || ficha,
    l.programName || 'ADSO',
    l.regional || 'Distrito Capital',
    l.trainingCenter || 'Centro de Servicios Financieros',
    l.status === 'aprobado'
      ? 'Aprobado'
      : l.status === 'requiere_refuerzo'
      ? 'Requiere Refuerzo'
      : 'En Inducción'
  ]);

  const caracData = [caracHeaders, ...caracRows];
  const caracSheet = XLSX.utils.aoa_to_sheet(caracData);
  caracSheet['!cols'] = calculateColumnWidths(caracData);
  XLSX.utils.book_append_sheet(workbook, caracSheet, 'Caracterización');

  // --- SHEET 2: PROGRESO MÓDULOS ---
  const progHeaders = [
    'Documento',
    'Nombre Completo',
    'Ficha',
    'Módulos Completados',
    'Porcentaje Avance',
    'Estado Inducción',
    'Módulo 1: Identidad SENA',
    'Módulo 2: Formación Profesional',
    'Módulo 3: Derechos y Deberes',
    'Módulo 4: Bienestar al Aprendiz',
    'Módulo 5: Entornos Tecnológicos',
    'Pacto Convivencia 2026',
    'Fecha Firma Pacto'
  ];

  const progRows = learners.map((l) => {
    const completedCount = l.completedModulesCount ?? (l.progressPercentage === 100 ? 5 : Math.round((l.progressPercentage / 100) * 5));
    return [
      l.documentNumber,
      l.fullName,
      l.ficha || ficha,
      `${completedCount} de 5`,
      `${l.progressPercentage}%`,
      l.status === 'aprobado' ? 'Aprobado' : l.status === 'requiere_refuerzo' ? 'Requiere Refuerzo' : 'En Progreso',
      completedCount >= 1 ? 'Completado' : 'Pendiente',
      completedCount >= 2 ? 'Completado' : 'Pendiente',
      completedCount >= 3 ? 'Completado' : 'Pendiente',
      completedCount >= 4 ? 'Completado' : 'Pendiente',
      completedCount >= 5 ? 'Completado' : 'Pendiente',
      l.hasSignedPact2026 ? 'Sí, Firmado digitalmente' : 'Pendiente de firma',
      l.pactSignedAt || 'Sin registro'
    ];
  });

  const progData = [progHeaders, ...progRows];
  const progSheet = XLSX.utils.aoa_to_sheet(progData);
  progSheet['!cols'] = calculateColumnWidths(progData);
  XLSX.utils.book_append_sheet(workbook, progSheet, 'Progreso Módulos');

  // --- SHEET 3: EVALUACIÓN ---
  const evalHeaders = [
    'Documento',
    'Nombre Completo',
    'Ficha',
    'Calificación (%)',
    'Resultado Final',
    'Aciertos (sobre 10)',
    'Total Preguntas',
    'Código de Constancia',
    'Fecha de Evaluación'
  ];

  const evalRows = learners.map((l) => {
    const hasScore = l.evaluationScore !== undefined;
    const scoreVal = hasScore ? l.evaluationScore! : 0;
    const correctCount = hasScore ? Math.round((scoreVal / 100) * 10) : 0;
    return [
      l.documentNumber,
      l.fullName,
      l.ficha || ficha,
      hasScore ? `${scoreVal}%` : 'Pendiente',
      l.status === 'aprobado'
        ? 'Aprobado (Certificado disponible)'
        : l.status === 'requiere_refuerzo'
        ? 'Requiere Refuerzo (Plan de mejoramiento)'
        : 'Pendiente por presentar',
      hasScore ? correctCount : 0,
      10,
      l.status === 'aprobado' ? `SENA-IND-${ficha}-${l.documentNumber.slice(-4)}` : 'N/A',
      l.evaluationDate || 'Sin registro'
    ];
  });

  const evalData = [evalHeaders, ...evalRows];
  const evalSheet = XLSX.utils.aoa_to_sheet(evalData);
  evalSheet['!cols'] = calculateColumnWidths(evalData);
  XLSX.utils.book_append_sheet(workbook, evalSheet, 'Evaluación');

  return workbook;
}

/**
 * Generates an Excel (.xlsx) file as a Uint8Array buffer for uploading directly to Google Drive.
 */
export function createCohortExcelBuffer(ficha: string, learners: CohortLearner[]): Uint8Array {
  const workbook = createCohortWorkbook(ficha, learners);
  const out = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(out);
}

/**
 * Generates and downloads a complete Excel workbook (.xlsx) with 3 organized sheets.
 */
export function downloadFullExcelWorkbook(ficha: string, learners: CohortLearner[]): void {
  const workbook = createCohortWorkbook(ficha, learners);
  const filename = `Ficha_${ficha}_Induccion_SENA.xlsx`;
  XLSX.writeFile(workbook, filename, { bookType: 'xlsx', compression: true });
}

/**
 * Downloads a single tab as a real .xlsx sheet
 */
export function downloadSingleTabExcel(
  sheetName: string,
  headers: string[],
  rows: (string | number | undefined | null)[][],
  filename: string
): void {
  const workbook = XLSX.utils.book_new();
  const data = [headers, ...rows];
  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet['!cols'] = calculateColumnWidths(data);
  XLSX.utils.book_append_sheet(workbook, sheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${filename}.xlsx`, { bookType: 'xlsx', compression: true });
}

/**
 * Downloads data as a properly formatted CSV with UTF-8 BOM and semicolon (;) separator
 * for immediate row/column alignment in Microsoft Excel configured with Spanish regional settings.
 */
export function downloadCompatibleCSV(
  headers: string[],
  rows: (string | number | undefined | null)[][],
  filename: string
): void {
  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent =
    '\uFEFF' +
    [
      headers.map(escapeCell).join(';'),
      ...rows.map((r) => r.map(escapeCell).join(';'))
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
