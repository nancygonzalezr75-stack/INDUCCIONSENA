import React, { useState } from 'react';
import { CohortLearner } from '../types/induction';
import {
  FileSpreadsheet,
  X,
  ExternalLink,
  Download,
  Search,
  Table,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderCheck,
  FileCheck,
  CloudUpload,
  RefreshCw
} from 'lucide-react';
import {
  downloadFullExcelWorkbook,
  downloadSingleTabExcel,
  downloadCompatibleCSV
} from '../utils/excelExporter';
import { getEffectiveDriveFolderUrl } from '../services/googleSheetsSync';

interface ExcelViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ficha: string;
  learners: CohortLearner[];
  spreadsheetUrl?: string | null;
  excelFileUrl?: string | null;
  folderUrl?: string | null;
  onSyncDrive?: () => Promise<any> | void;
}

type TabType = 'caracterizacion' | 'progreso' | 'evaluacion';

export const ExcelViewerModal: React.FC<ExcelViewerModalProps> = ({
  isOpen,
  onClose,
  ficha,
  learners,
  spreadsheetUrl,
  excelFileUrl,
  folderUrl,
  onSyncDrive
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('caracterizacion');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLearners = learners.filter((l) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.fullName.toLowerCase().includes(q) ||
      l.documentNumber.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      (l.populationType && l.populationType.toLowerCase().includes(q))
    );
  });

  const getTabExportData = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeTab === 'caracterizacion') {
      headers = [
        'Documento',
        'Tipo Doc',
        'Nombre Completo',
        'Correo Institucional',
        'Teléfono',
        'Ciudad / Municipio',
        'Dirección Residencia',
        'Género',
        'Tipo de Población',
        'Ficha',
        'Programa de Formación'
      ];
      rows = filteredLearners.map((l) => [
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
        l.programName || 'ADSO'
      ]);
    } else if (activeTab === 'progreso') {
      headers = [
        'Documento',
        'Nombre Completo',
        'Ficha',
        'Módulos Completados',
        'Porcentaje Avance',
        'Estado Inducción',
        'Pacto 2026',
        'Fecha Firma Pacto'
      ];
      rows = filteredLearners.map((l) => [
        l.documentNumber,
        l.fullName,
        l.ficha || ficha,
        `${l.completedModulesCount ?? (l.progressPercentage === 100 ? 5 : Math.round((l.progressPercentage / 100) * 5))}/5`,
        `${l.progressPercentage}%`,
        l.status === 'aprobado' ? 'Aprobado' : l.status === 'requiere_refuerzo' ? 'Requiere Refuerzo' : 'En Inducción',
        l.hasSignedPact2026 ? 'Sí, Firmado' : 'Pendiente',
        l.pactSignedAt || 'Sin firmar'
      ]);
    } else {
      headers = [
        'Documento',
        'Nombre Completo',
        'Ficha',
        'Calificación (%)',
        'Resultado',
        'Preguntas Correctas',
        'Total Preguntas',
        'Código Constancia',
        'Fecha Evaluación'
      ];
      rows = filteredLearners.map((l) => [
        l.documentNumber,
        l.fullName,
        l.ficha || ficha,
        l.evaluationScore !== undefined ? `${l.evaluationScore}%` : 'Pendiente',
        l.status === 'aprobado'
          ? 'Aprobado'
          : l.status === 'requiere_refuerzo'
          ? 'Requiere Refuerzo'
          : 'En Inducción',
        l.evaluationScore !== undefined ? Math.round((l.evaluationScore / 100) * 10) : 0,
        10,
        l.status === 'aprobado' ? `SENA-IND-${ficha}-${l.documentNumber.slice(-4)}` : 'N/A',
        l.evaluationDate || 'Sin registro'
      ]);
    }
    return { headers, rows };
  };

  const handleDownloadFullWorkbook = () => {
    downloadFullExcelWorkbook(ficha, learners);
  };

  const handleDownloadActiveTabExcel = () => {
    const { headers, rows } = getTabExportData();
    const tabName =
      activeTab === 'caracterizacion'
        ? 'Caracterización'
        : activeTab === 'progreso'
        ? 'Progreso Módulos'
        : 'Evaluación';
    downloadSingleTabExcel(
      tabName,
      headers,
      rows,
      `Ficha_${ficha}_${tabName.replace(/\s+/g, '_')}`
    );
  };

  const handleDownloadActiveTabCSV = () => {
    const { headers, rows } = getTabExportData();
    const tabName =
      activeTab === 'caracterizacion'
        ? 'Caracterizacion'
        : activeTab === 'progreso'
        ? 'Progreso_Modulos'
        : 'Evaluacion';
    downloadCompatibleCSV(headers, rows, `Ficha_${ficha}_${tabName}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Excel Ribbon Bar */}
        <div className="bg-[#107c41] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#0b5c30]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#107c41] flex items-center justify-center font-bold text-sm shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  Ficha {ficha} - Inducción SENA.xlsx
                </h3>
                <span className="text-[10px] bg-[#0b5c30] px-2 py-0.5 rounded font-mono text-emerald-100">
                  Libro Excel (.xlsx)
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Organizado en filas y columnas · 3 hojas vinculadas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={getEffectiveDriveFolderUrl(folderUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-amber-500/25 hover:bg-amber-500/40 text-amber-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-amber-400/40 cursor-pointer active:scale-95"
              title="Abrir carpeta BOOT CAMP INDUCCIÓN en Google Drive"
            >
              <FolderCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Carpeta BOOT CAMP INDUCCIÓN</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            {/* Direct Link to Excel file (.xlsx) in Drive */}
            {excelFileUrl && (
              <a
                href={excelFileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-teal-500/30 hover:bg-teal-500/50 text-teal-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-teal-400/50 cursor-pointer active:scale-95"
                title="Abrir archivo Excel (.xlsx) directamente en Google Drive"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>Ver Excel en Drive</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            )}

            {/* Save directly to Drive folder */}
            {onSyncDrive && (
              <button
                type="button"
                onClick={async () => {
                  setIsSyncing(true);
                  setSyncSuccessMsg(null);
                  try {
                    await onSyncDrive();
                    setSyncSuccessMsg('¡Guardado en carpeta BOOT CAMP INDUCCIÓN!');
                    setTimeout(() => setSyncSuccessMsg(null), 3500);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsSyncing(false);
                  }
                }}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-emerald-600/70 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-400/60 shadow-xs cursor-pointer active:scale-95"
                title="Guardar este libro Excel (.xlsx) directamente en la carpeta BOOT CAMP INDUCCIÓN de Google Drive"
              >
                <CloudUpload className={`w-3.5 h-3.5 text-emerald-200 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Guardando en Drive...' : 'Guardar en Drive'}</span>
              </button>
            )}

            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
                title="Abrir en Google Sheets"
              >
                <span>Abrir Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Primary Action: Download complete Excel Workbook (.xlsx) */}
            <button
              onClick={handleDownloadFullWorkbook}
              className="px-3.5 py-1.5 bg-white text-[#107c41] hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
              title="Descargar libro Excel (.xlsx) con pestañas de Caracterización, Progreso y Evaluación en filas y columnas separadas"
            >
              <Download className="w-3.5 h-3.5 text-[#107c41]" />
              <span>Descargar Excel (.xlsx)</span>
            </button>

            {/* Secondary Action: Download current sheet as .xlsx */}
            <button
              onClick={handleDownloadActiveTabExcel}
              className="px-2.5 py-1.5 bg-[#0b5c30] hover:bg-[#084323] text-emerald-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border border-emerald-600/40 cursor-pointer"
              title="Descargar solo la hoja actual como archivo Excel .xlsx"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Hoja (.xlsx)</span>
            </button>

            {/* Compatible CSV option */}
            <button
              onClick={handleDownloadActiveTabCSV}
              className="px-2.5 py-1.5 bg-[#0b5c30] hover:bg-[#084323] text-emerald-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 border border-emerald-600/40 cursor-pointer"
              title="Descargar CSV con separador ';' compatible con Excel"
            >
              <span>CSV (;)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1 cursor-pointer"
              aria-label="Cerrar visualizador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync confirmation notification */}
        {syncSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs px-5 py-2 font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              <span>{syncSuccessMsg}</span>
            </div>
            {excelFileUrl && (
              <a
                href={excelFileUrl}
                target="_blank"
                rel="noreferrer"
                className="underline font-bold text-white hover:text-emerald-100 flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir archivo Excel en Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Toolbar with Search and Tab Selector */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              onClick={() => setActiveTab('caracterizacion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'caracterizacion'
                  ? 'bg-[#107c41] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>1. Caracterización</span>
            </button>
            <button
              onClick={() => setActiveTab('progreso')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'progreso'
                  ? 'bg-[#107c41] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>2. Progreso Módulos</span>
            </button>
            <button
              onClick={() => setActiveTab('evaluacion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'evaluacion'
                  ? 'bg-[#107c41] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Evaluación</span>
            </button>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar en esta pestaña..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#107c41] text-slate-900 dark:text-white placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Excel Spreadsheet Grid View */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 font-sans text-xs">
          <table className="w-full border-collapse border border-slate-200 dark:border-slate-800">
            {/* Column letters row */}
            <thead className="sticky top-0 z-20 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono select-none">
              <tr>
                <th className="w-10 px-2 py-1.5 text-center border border-slate-300 dark:border-slate-700 bg-slate-300 dark:bg-slate-700 font-bold">
                  #
                </th>
                {activeTab === 'caracterizacion' && (
                  <>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">A · Documento</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">B · Tipo Doc</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">C · Nombre Completo</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">D · Correo Institucional</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">E · Teléfono</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">F · Ciudad</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">G · Dirección</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">H · Género</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">I · Tipo Población</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">J · Ficha</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">K · Programa</th>
                  </>
                )}
                {activeTab === 'progreso' && (
                  <>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">A · Documento</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">B · Nombre Completo</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">C · Ficha</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">D · Módulos</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">E · Avance (%)</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">F · Estado</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">G · Pacto 2026</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">H · Fecha Pacto</th>
                  </>
                )}
                {activeTab === 'evaluacion' && (
                  <>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">A · Documento</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">B · Nombre Completo</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">C · Ficha</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">D · Calificación (%)</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">E · Resultado</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">F · Aciertos</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">G · Total</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">H · Código Constancia</th>
                    <th className="px-3 py-1.5 text-left border border-slate-300 dark:border-slate-700">I · Fecha Evaluación</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="py-12 text-center text-slate-400 dark:text-slate-500 italic"
                  >
                    No se encontraron registros para el filtro actual.
                  </td>
                </tr>
              ) : (
                filteredLearners.map((lrn, index) => (
                  <tr
                    key={lrn.id}
                    className="hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Row Index */}
                    <td className="px-2 py-2 text-center border-r border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                      {index + 2}
                    </td>

                    {/* Tab 1: Caracterización */}
                    {activeTab === 'caracterizacion' && (
                      <>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.documentNumber}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.documentType || 'CC'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                          {lrn.fullName}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                          {lrn.email}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.phone || 'N/A'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800">
                          {lrn.city || 'Bogotá'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 truncate max-w-[140px]">
                          {lrn.address || 'N/A'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 capitalize">
                          {lrn.gender || 'No especificado'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 capitalize">
                          {lrn.populationType || 'General'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.ficha || ficha}
                        </td>
                        <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 truncate max-w-[180px]">
                          {lrn.programName}
                        </td>
                      </>
                    )}

                    {/* Tab 2: Progreso Módulos */}
                    {activeTab === 'progreso' && (
                      <>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.documentNumber}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                          {lrn.fullName}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.ficha || ficha}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.completedModulesCount ?? 0}/5
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono font-bold text-[#107c41]">
                          {lrn.progressPercentage ?? 0}%
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800">
                          {lrn.status === 'aprobado' ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              Aprobado
                            </span>
                          ) : lrn.status === 'requiere_refuerzo' ? (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">
                              Requiere Refuerzo
                            </span>
                          ) : (
                            <span className="text-slate-500">En Inducción</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800">
                          {lrn.hasSignedPact2026 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              Firmado ✓
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pendiente</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500">
                          {lrn.pactSignedAt || 'N/A'}
                        </td>
                      </>
                    )}

                    {/* Tab 3: Evaluación */}
                    {activeTab === 'evaluacion' && (
                      <>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.documentNumber}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                          {lrn.fullName}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono">
                          {lrn.ficha || ficha}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono font-bold">
                          {lrn.evaluationScore !== undefined ? (
                            <span
                              className={
                                lrn.evaluationScore >= 80
                                  ? 'text-[#107c41]'
                                  : 'text-amber-600 dark:text-amber-400'
                              }
                            >
                              {lrn.evaluationScore}%
                            </span>
                          ) : (
                            <span className="text-slate-400 italic font-normal">Pendiente</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800">
                          {lrn.status === 'aprobado' ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              Aprobado
                            </span>
                          ) : lrn.status === 'requiere_refuerzo' ? (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">
                              Requiere Refuerzo
                            </span>
                          ) : (
                            <span className="text-slate-500">En Curso</span>
                          )}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono text-center">
                          {lrn.evaluationScore !== undefined
                            ? Math.round((lrn.evaluationScore / 100) * 10)
                            : '-'}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono text-center">
                          10
                        </td>
                        <td className="px-3 py-2 border-r border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {lrn.status === 'aprobado'
                            ? `SENA-IND-${ficha}-${lrn.documentNumber.slice(-4)}`
                            : 'N/A'}
                        </td>
                        <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500">
                          {lrn.evaluationDate || 'Sin registro'}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Excel Status Bar Footer */}
        <div className="bg-slate-100 dark:bg-slate-800/90 px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span>
              Total aprendices en hoja: <strong>{filteredLearners.length}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Ficha:{' '}
              <strong className="text-slate-900 dark:text-white font-mono">{ficha}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">
              Pestaña activa: <strong>{activeTab}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {spreadsheetUrl ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Vinculado con Google Drive</span>
              </span>
            ) : (
              <button
                onClick={onSyncDrive}
                className="text-xs text-[#107c41] dark:text-[#39A900] hover:underline font-semibold"
              >
                Sincronizar archivo en Google Drive
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
