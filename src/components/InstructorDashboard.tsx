import React, { useState } from 'react';
import { CohortLearner, EvaluationQuestion } from '../types/induction';
import { EVALUATION_QUESTIONS } from '../data/inductionContent';
import { Users, Award, AlertCircle, FileSpreadsheet, Plus, CheckCircle, Search, BookOpen, Clock, Download, FolderCheck, ExternalLink, FileCheck, CloudUpload } from 'lucide-react';
import { GoogleDriveSyncCard } from './GoogleDriveSyncCard';
import { ExcelViewerModal } from './ExcelViewerModal';
import { downloadFullExcelWorkbook, downloadCompatibleCSV } from '../utils/excelExporter';
import { FichaSyncResult, getEffectiveDriveFolderUrl } from '../services/googleSheetsSync';
import { User as FirebaseUser } from 'firebase/auth';

interface InstructorDashboardProps {
  learners: CohortLearner[];
  isReadOnly?: boolean;
  onAddLearner: (learner: CohortLearner) => void;
  onEditLearner: (learner: CohortLearner) => void;
  currentFicha?: string;
  googleUser?: FirebaseUser | null;
  googleToken?: string | null;
  onGoogleAuthChange?: (user: FirebaseUser | null, token: string | null) => void;
  onManualSync?: () => Promise<FichaSyncResult>;
  lastSyncResult?: FichaSyncResult | null;
  isAutoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  learners,
  isReadOnly = false,
  onAddLearner,
  onEditLearner,
  currentFicha = '2873190',
  googleUser = null,
  googleToken = null,
  onGoogleAuthChange,
  onManualSync,
  lastSyncResult = null,
  isAutoSyncEnabled = true,
  onToggleAutoSync
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'aprendices' | 'banco-preguntas' | 'analitica'>('aprendices');
  const [noticeSentId, setNoticeSentId] = useState<string | null>(null);
  const [showExcelModal, setShowExcelModal] = useState<boolean>(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);

  // New question form state
  const [questionsList, setQuestionsList] = useState<EvaluationQuestion[]>(EVALUATION_QUESTIONS);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestionData, setNewQuestionData] = useState({
    category: 'Derechos y Deberes',
    scenario: '',
    question: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctIndex: 0,
    reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 8º'
  });

  // Calculate cohort metrics
  const totalLearners = learners.length;
  const passedLearners = learners.filter((l) => l.status === 'aprobado');
  const passRate = totalLearners > 0 ? Math.round((passedLearners.length / totalLearners) * 100) : 0;
  const scoredLearners = learners.filter((l) => l.evaluationScore !== undefined);
  const avgScore =
    scoredLearners.length > 0
      ? Math.round(scoredLearners.reduce((acc, curr) => acc + (curr.evaluationScore || 0), 0) / scoredLearners.length)
      : 0;
  const needingReinforcement = learners.filter((l) => l.status === 'requiere_refuerzo').length;

  const filteredLearners = learners.filter((l) => {
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      l.fullName.toLowerCase().includes(q) ||
      l.documentNumber.includes(q) ||
      l.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleDownloadFullExcel = () => {
    downloadFullExcelWorkbook(currentFicha, learners);
  };

  const handleDownloadCSV = () => {
    const headers = [
      'Documento',
      'Tipo Doc',
      'Nombre Completo',
      'Correo Institucional',
      'Teléfono',
      'Ciudad',
      'Dirección',
      'Género',
      'Tipo de Población',
      'Ficha',
      'Programa',
      'Estado Inducción',
      'Progreso (%)',
      'Calificación Evaluación',
      'Fecha Evaluación',
      'Pacto Firmado'
    ];

    const rows = learners.map((l) => [
      l.documentNumber,
      l.documentType || 'CC',
      l.fullName,
      l.email,
      l.phone || 'No registrado',
      l.city || 'No registrada',
      l.address || 'No registrada',
      l.gender || 'No especificado',
      l.populationType || 'General',
      l.ficha || currentFicha,
      l.programName || 'ADSO',
      l.status === 'aprobado' ? 'Aprobado' : l.status === 'requiere_refuerzo' ? 'Requiere Refuerzo' : 'En Inducción',
      `${l.progressPercentage}%`,
      l.evaluationScore !== undefined ? `${l.evaluationScore}%` : 'Pendiente',
      l.evaluationDate || 'Sin registro',
      l.hasSignedPact2026 ? 'Sí, Firmado' : 'Pendiente'
    ]);

    downloadCompatibleCSV(headers, rows, `Reporte_Induccion_SENA_Ficha_${currentFicha}`);
  };

  const handleSendReinforcementNotice = (learnerId: string) => {
    setNoticeSentId(learnerId);
    setTimeout(() => {
      setNoticeSentId(null);
    }, 3000);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: EvaluationQuestion = {
      id: `q-custom-${Date.now()}`,
      moduleId: 'derechos-deberes',
      category: newQuestionData.category,
      scenario: newQuestionData.scenario,
      question: newQuestionData.question,
      options: [
        { text: newQuestionData.opt0, rationale: 'Opción registrada por instructor.' },
        { text: newQuestionData.opt1, rationale: 'Opción registrada por instructor.' },
        { text: newQuestionData.opt2, rationale: 'Opción registrada por instructor.' },
        { text: newQuestionData.opt3, rationale: 'Opción registrada por instructor.' }
      ],
      correctIndex: Number(newQuestionData.correctIndex),
      reglamentoCitation: newQuestionData.reglamentoCitation,
      difficulty: 'intermedio'
    };

    setQuestionsList([newQ, ...questionsList]);
    setShowNewQuestionModal(false);
    setNewQuestionData({
      category: 'Derechos y Deberes',
      scenario: '',
      question: '',
      opt0: '',
      opt1: '',
      opt2: '',
      opt3: '',
      correctIndex: 0,
      reglamentoCitation: 'Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), Art. 8º'
    });
  };

  const effectiveFolderUrl = getEffectiveDriveFolderUrl(lastSyncResult?.folderUrl);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
              <span>Gestión de Inducción</span>
              <span aria-hidden="true">·</span>
              <span>Ficha 2873190 · ADSO</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Panel del Instructor y Coordinación Académica
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Monitoreo del nivel de apropiación del proceso de inducción, derechos, deberes y reglamento en la cohorte.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={effectiveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Abrir la carpeta BOOT CAMP INDUCCIÓN en Google Drive"
            >
              <FolderCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Carpeta Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {lastSyncResult?.excelFileUrl && (
              <a
                href={lastSyncResult.excelFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-xs font-bold text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 border border-teal-300 dark:border-teal-700 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Abrir el archivo Excel (.xlsx) de la ficha en Google Drive"
              >
                <FileCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Ver Excel en Drive</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            <button
              onClick={() => setShowExcelModal(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#107c41] hover:bg-[#0c6233] rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Visualizar la hoja de cálculo interactiva de la ficha con pestañas de Caracterización, Módulos y Evaluación"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Visualizar Excel</span>
            </button>

            {!isReadOnly && onManualSync && (
              <button
                onClick={async () => {
                  setIsSavingToDrive(true);
                  try {
                    await onManualSync();
                  } finally {
                    setIsSavingToDrive(false);
                  }
                }}
                disabled={isSavingToDrive}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d7a04] rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Guardar archivos Excel (.xlsx) y Google Sheets de la ficha directamente en la carpeta BOOT CAMP INDUCCIÓN"
              >
                <CloudUpload className={`w-4 h-4 ${isSavingToDrive ? 'animate-bounce' : ''}`} />
                <span>{isSavingToDrive ? 'Guardando en Drive...' : 'Guardar Excel en Drive'}</span>
              </button>
            )}

            <button
              onClick={handleDownloadFullExcel}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              title="Descargar archivo Excel (.xlsx) organizado en filas y columnas con las 3 pestañas"
            >
              <Download className="w-4 h-4 text-[#107c41]" />
              <span>Descargar .xlsx</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Descargar reporte en formato CSV separado por ';' compatible con Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV (;)</span>
            </button>
            {!isReadOnly && (
              <button
                onClick={() => setShowNewQuestionModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Pregunta</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('aprendices')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'aprendices'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
            Aprendices ({learners.length})
          </button>
          <button
            onClick={() => setActiveTab('analitica')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'analitica'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
            Métricas de Apropiación
          </button>
          {!isReadOnly && (
            <button
              onClick={() => setActiveTab('banco-preguntas')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'banco-preguntas'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Banco de Preguntas ({questionsList.length})
            </button>
          )}
        </div>
      </div>

      {/* Google Drive & Sheets Sync Card */}
      {onGoogleAuthChange && onManualSync && onToggleAutoSync && (
        <GoogleDriveSyncCard
          currentFicha={currentFicha}
          googleUser={googleUser}
          googleToken={googleToken}
          onAuthChange={onGoogleAuthChange}
          onManualSync={onManualSync}
          lastSyncResult={lastSyncResult}
          isAutoSyncEnabled={isAutoSyncEnabled}
          onToggleAutoSync={onToggleAutoSync}
          onOpenExcelViewer={() => setShowExcelModal(true)}
        />
      )}

      {/* Cohort KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Total Aprendices</span>
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalLearners}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ficha Activa 2873190</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Tasa de Apropiación</span>
            <Award className="w-4 h-4 text-[#39A900] dark:text-[#4cd900]" />
          </div>
          <div className="text-3xl font-extrabold text-[#39A900] dark:text-[#4cd900]">{passRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{passedLearners.length} aprendices aprobados (≥80%)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Promedio de Evaluación</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgScore}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Sobre {scoredLearners.length} evaluaciones realizadas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Requieren Refuerzo</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{needingReinforcement}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Puntaje menor al 80% institucional</div>
        </div>
      </div>

      {/* TAB: APRENDICES */}
      {activeTab === 'aprendices' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o cédula..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('aprobado')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === 'aprobado' ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Aprobados
              </button>
              <button
                onClick={() => setFilterStatus('requiere_refuerzo')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === 'requiere_refuerzo' ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Refuerzo
              </button>
              <button
                onClick={() => setFilterStatus('en_induccion')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === 'en_induccion' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                En Inducción
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Aprendiz</th>
                  <th className="py-3 px-3">Documento</th>
                  <th className="py-3 px-3">Contacto</th>
                  <th className="py-3 px-3">Género / Población</th>
                  <th className="py-3 px-3">Módulos</th>
                  <th className="py-3 px-3">Evaluación</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredLearners.map((lrn) => (
                  <tr key={lrn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{lrn.fullName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{lrn.email}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {lrn.documentType} {lrn.documentNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {lrn.phone || 'N/A'} · {lrn.city || 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-500 truncate max-w-[150px]">
                        {lrn.address || 'Sin dirección'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="text-slate-600 dark:text-slate-400">Género: {lrn.gender || 'N/A'}</div>
                      <div className="text-slate-600 dark:text-slate-400">Pob: {lrn.populationType || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#39A900] dark:bg-[#4cd900] h-full"
                            style={{ width: `${(((lrn.completedModulesCount ?? 0) / 5)) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {lrn.completedModulesCount ?? 0}/5
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {lrn.evaluationScore !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              lrn.evaluationScore >= 80 ? 'text-[#39A900] dark:text-[#4cd900]' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {lrn.evaluationScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Pendiente</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {lrn.status === 'aprobado' && (
                        <div>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            Apropiado
                          </span>
                        </div>
                      )}
                      {lrn.status === 'requiere_refuerzo' && (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          Requiere Refuerzo
                        </span>
                      )}
                      {lrn.status === 'en_induccion' && (
                        <span className="text-slate-600 dark:text-slate-400">
                          En Progreso
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onEditLearner(lrn)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Ver Perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ANALÍTICA */}
      {activeTab === 'analitica' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              Dominio por Competencia Temática
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desempeño acumulado de los aprendices en las preguntas de la evaluación interactiva.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Identidad y Símbolos Institucionales', pct: 92, status: 'Sobresaliente' },
                { name: 'Derechos y Deberes (Acuerdo 009/2024, Art. 5º y 8º)', pct: 84, status: 'Aceptable' },
                { name: 'Comité de Evaluación y Garantías (Art. 48 Reformado 2026)', pct: 78, status: 'Aceptable' },
                { name: 'Prácticas Laborales y Tutoría (Decreto 0223/2026)', pct: 88, status: 'Sobresaliente' },
                { name: 'Ética Digital e Inteligencia Artificial en Zajuna 2026', pct: 85, status: 'Sobresaliente' },
                { name: 'Bienestar al Aprendiz y Liderazgo', pct: 90, status: 'Sobresaliente' },
                { name: 'Ecosistema SOFIA Plus y Zajuna', pct: 95, status: 'Sobresaliente' }
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>{item.name}</span>
                    <span className={item.pct >= 80 ? 'text-[#39A900] dark:text-[#4cd900]' : 'text-amber-600 dark:text-amber-400'}>
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.pct >= 80 ? 'bg-[#39A900] dark:bg-[#4cd900]' : 'bg-amber-500'}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              Acciones Pedagógicas Recomendadas · Vigencia 2026
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  1. Implementación del Decreto 0223 de 2026 (Prácticas Laborales)
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  El 88% de los aprendices asimilaron la figura del tutor empresarial obligatorio y la cobertura de ARL desde el inicio de la etapa productiva.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                  2. Taller de Refuerzo: Comité y Primacía Formativa (Art. 48)
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Fortalecer en los aprendices el conocimiento del debido proceso, la notificación al correo institucional @soysena.edu.co y el carácter obligatorio de los planes de mejoramiento antes de cualquier sanción.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                  3. Suscripción del Pacto de Convivencia y Matrícula 2026
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  Verificar que el 100% de la ficha complete la firma digital del Pacto de Convivencia para legalizar formalmente la matrícula en el sistema de gestión del centro.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BANCO DE PREGUNTAS */}
      {activeTab === 'banco-preguntas' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Banco de Preguntas Institucionales de Evaluación
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reactivos utilizados para medir la apropiación del proceso de inducción
              </p>
            </div>
            <button
              onClick={() => setShowNewQuestionModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Pregunta
            </button>
          </div>

          <div className="space-y-3">
            {questionsList.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-bold text-[#39A900] dark:text-[#4cd900]">
                    Pregunta {idx + 1} · {q.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {q.reglamentoCitation}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{q.question}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mb-2">"{q.scenario}"</p>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <strong>Respuesta correcta:</strong> {q.options[q.correctIndex].text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Question Modal */}
      {showNewQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-600">
              <h3 className="font-bold text-sm text-white">Nueva Pregunta para la Evaluación</h3>
              <button
                onClick={() => setShowNewQuestionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Área Temática</label>
                <select
                  value={newQuestionData.category}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, category: e.target.value })}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                >
                  <option value="Derechos y Deberes">Derechos y Deberes</option>
                  <option value="Identidad Institucional">Identidad Institucional</option>
                  <option value="Ruta de Formación">Ruta de Formación</option>
                  <option value="Bienestar y Representación">Bienestar y Representación</option>
                  <option value="Ecosistema Digital">Ecosistema Digital</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Caso o Situación Real</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionData.scenario}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, scenario: e.target.value })}
                  placeholder="Ej. Un aprendiz no entrega evidencias y acumula 3 faltas..."
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pregunta</label>
                <input
                  required
                  type="text"
                  value={newQuestionData.question}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, question: e.target.value })}
                  placeholder="¿Qué medida formativa corresponde según el reglamento?"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Opciones de Respuesta</label>
                <input
                  required
                  type="text"
                  placeholder="Opción A"
                  value={newQuestionData.opt0}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, opt0: e.target.value })}
                  className="w-full p-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
                <input
                  required
                  type="text"
                  placeholder="Opción B"
                  value={newQuestionData.opt1}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, opt1: e.target.value })}
                  className="w-full p-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
                <input
                  required
                  type="text"
                  placeholder="Opción C"
                  value={newQuestionData.opt2}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, opt2: e.target.value })}
                  className="w-full p-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
                <input
                  required
                  type="text"
                  placeholder="Opción D"
                  value={newQuestionData.opt3}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, opt3: e.target.value })}
                  className="w-full p-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Opción Correcta</label>
                  <select
                    value={newQuestionData.correctIndex}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, correctIndex: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                  >
                    <option value={0}>Opción A</option>
                    <option value={1}>Opción B</option>
                    <option value={2}>Opción C</option>
                    <option value={3}>Opción D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cita Normativa</label>
                  <input
                    type="text"
                    value={newQuestionData.reglamentoCitation}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, reglamentoCitation: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] font-semibold rounded-lg cursor-pointer"
                >
                  Guardar Pregunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Spreadsheet Viewer Modal */}
      <ExcelViewerModal
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        ficha={currentFicha}
        learners={learners}
        spreadsheetUrl={lastSyncResult?.spreadsheetUrl}
        excelFileUrl={lastSyncResult?.excelFileUrl}
        folderUrl={effectiveFolderUrl}
        onSyncDrive={onManualSync}
      />
    </div>
  );
};
