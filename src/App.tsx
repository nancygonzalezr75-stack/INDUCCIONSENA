/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, Role, EvaluationResult, CohortLearner } from './types/induction';
import { INITIAL_LEARNER_PROFILE } from './data/inductionContent';
import { INITIAL_COHORT_LEARNERS } from './data/mockLearners';
import { Navbar } from './components/Navbar';
import { ModuleViewer } from './components/ModuleViewer';
import { InstitutionalSymbols } from './components/InstitutionalSymbols';
import { RightsAndDutiesExplorer } from './components/RightsAndDutiesExplorer';
import { InteractiveEvaluation } from './components/InteractiveEvaluation';
import { OfficialCertificate } from './components/OfficialCertificate';
import { InstructorDashboard } from './components/InstructorDashboard';
import { LearnerProfileModal } from './components/LearnerProfileModal';
import { PactoConvivenciaModal } from './components/PactoConvivenciaModal';
import { ManualModal } from './components/ManualModal';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import { SenaLogo } from './components/SenaLogo';
import { ShieldCheck, ExternalLink, Cloud, CheckCircle, ClipboardList } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { initAuth, getAccessToken } from './services/googleAuth';
import {
  syncCohortToDrive,
  FichaSyncResult,
  getCachedFichaSheet,
  getCachedFichaSyncResult,
  getEffectiveDriveFolderUrl,
  TARGET_DRIVE_FOLDER_NAME,
  getOrCreateDriveFolder
} from './services/googleSheetsSync';
import { User as FirebaseUser } from 'firebase/auth';

const STORAGE_KEYS = {
  PROFILE: 'sena_induction_learner_profile',
  RESULT: 'sena_induction_evaluation_result',
  COHORT: 'sena_induction_cohort_learners',
  THEME: 'sena_theme_mode'
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authRole, setAuthRole] = useState<Role>('learner');
  const [viewedRole, setViewedRole] = useState<Role>('learner');
  const [activeTab, setActiveTab] = useState<string>('modulos');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<CohortLearner | null>(null);
  const [isPactModalOpen, setIsPactModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Google Workspace Integration State
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sena_auto_sync') !== 'false';
    } catch {
      return true;
    }
  });
  const [lastSyncResult, setLastSyncResult] = useState<FichaSyncResult | null>(() => {
    const cachedSync = getCachedFichaSyncResult('2873190');
    if (cachedSync) return cachedSync;
    const cachedSheet = getCachedFichaSheet('2873190');
    const folderUrl = getEffectiveDriveFolderUrl();
    const folderId = localStorage.getItem('sena_drive_folder_id') || undefined;
    return cachedSheet
      ? {
          success: true,
          spreadsheetId: cachedSheet.id,
          spreadsheetUrl: cachedSheet.url,
          folderId,
          folderUrl,
          folderName: TARGET_DRIVE_FOLDER_NAME,
          message: 'Hoja de cálculo vinculada',
          timestamp: 'Guardada en Drive'
        }
      : {
          success: false,
          folderUrl,
          folderId,
          folderName: TARGET_DRIVE_FOLDER_NAME,
          message: 'Pendiente de sincronizar',
          timestamp: ''
        };
  });
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dark Mode State & Blur Transition State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [isBlurringTheme, setIsBlurringTheme] = useState(false);

  // Sync document element dark class on initial mount & state change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handler for smooth theme switch with blur transition
  const handleToggleDarkMode = () => {
    setIsBlurringTheme(true);
    setTimeout(() => {
      setIsDarkMode((prev) => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        try {
          localStorage.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
        } catch {}
        return next;
      });
    }, 180);
    setTimeout(() => {
      setIsBlurringTheme(false);
    }, 480);
  };

  // Apprentice Profile state
  const [apprentice, setApprentice] = useState<ApprenticeProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_LEARNER_PROFILE;
    } catch {
      return INITIAL_LEARNER_PROFILE;
    }
  });

  // Evaluation Result state
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESULT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cohort Learners state
  const [cohortLearners, setCohortLearners] = useState<CohortLearner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COHORT);
      return saved ? JSON.parse(saved) : INITIAL_COHORT_LEARNERS;
    } catch {
      return INITIAL_COHORT_LEARNERS;
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(apprentice));
    } catch {}
  }, [apprentice]);

  useEffect(() => {
    try {
      if (evaluationResult) {
        localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(evaluationResult));
      }
    } catch {}
  }, [evaluationResult]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohortLearners));
    } catch {}
  }, [cohortLearners]);

  // Listen to Google Authentication State via Firebase
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (token) {
          try {
            const folder = await getOrCreateDriveFolder(token);
            setLastSyncResult((prev) => ({
              ...(prev || {
                success: false,
                message: 'Conectado a Google Drive',
                timestamp: ''
              }),
              folderId: folder.id,
              folderUrl: folder.url,
              folderName: folder.name
            }));
          } catch (e) {
            console.warn('Pre-resolviendo información de la carpeta:', e);
          }
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleToggleAutoSync = (enabled: boolean) => {
    setIsAutoSyncEnabled(enabled);
    try {
      localStorage.setItem('sena_auto_sync', String(enabled));
    } catch {}
  };

  // Perform synchronization for the cohort and active learner to Google Sheets
  const performFichaSync = async (
    overrideCohort?: CohortLearner[],
    overrideApprentice?: ApprenticeProfile,
    overrideEvaluation?: EvaluationResult | null
  ): Promise<FichaSyncResult> => {
    const token = googleToken || (await getAccessToken());
    if (!token) {
      return {
        success: false,
        message: 'Conecta tu cuenta institucional de Google para habilitar la sincronización.',
        timestamp: new Date().toLocaleTimeString('es-CO')
      };
    }

    const targetFicha = (overrideApprentice || apprentice).ficha || '2873190';
    const targetCohort = overrideCohort || cohortLearners;
    const targetApprentice = overrideApprentice || apprentice;
    const targetEval = overrideEvaluation !== undefined ? overrideEvaluation : evaluationResult;

    const result = await syncCohortToDrive(
      token,
      targetFicha,
      targetCohort,
      targetApprentice,
      targetEval
    );

    setLastSyncResult(result);
    if (result.success) {
      setSyncToast({
        message: `Ficha ${targetFicha} (Excel .xlsx y Google Sheet) guardada en la carpeta '${result.folderName || TARGET_DRIVE_FOLDER_NAME}'`,
        type: 'success'
      });
      setTimeout(() => setSyncToast(null), 4000);
    }
    return result;
  };

  const handleToggleModuleComplete = (moduleId: string) => {
    setApprentice((prev) => {
      const isAlreadyCompleted = prev.completedModules.includes(moduleId);
      const newCompleted = isAlreadyCompleted
        ? prev.completedModules.filter((m) => m !== moduleId)
        : [...prev.completedModules, moduleId];

      const updated = {
        ...prev,
        completedModules: newCompleted
      };

      if (isAutoSyncEnabled && (googleToken || googleUser)) {
        performFichaSync(cohortLearners, updated);
      }

      return updated;
    });
  };

  const handleSaveEvaluationResult = (res: EvaluationResult) => {
    setEvaluationResult(res);
    const updatedApprentice: ApprenticeProfile = {
      ...apprentice,
      status: res.passed ? 'aprobado' : 'requiere_refuerzo',
      evaluationScore: res.score,
      evaluationCompletedAt: res.completedAt
    };
    setApprentice(updatedApprentice);

    const updatedCohort: CohortLearner[] = cohortLearners.map((l) =>
      l.id === apprentice.id
        ? {
            ...l,
            status: (res.passed ? 'aprobado' : 'requiere_refuerzo') as 'aprobado' | 'requiere_refuerzo',
            evaluationScore: res.score,
            evaluationDate: res.completedAt,
            progressPercentage: 100,
            completedModulesCount: 5
          }
        : l
    );
    setCohortLearners(updatedCohort);

    if (isAutoSyncEnabled && (googleToken || googleUser)) {
      performFichaSync(updatedCohort, updatedApprentice, res);
    }
  };

  const handleSaveProfile = (updatedProfile: ApprenticeProfile) => {
    setApprentice(updatedProfile);
    const updatedCohort = cohortLearners.map((l) =>
      l.id === updatedProfile.id
        ? {
            ...l,
            fullName: updatedProfile.fullName,
            documentType: updatedProfile.documentType,
            documentNumber: updatedProfile.documentNumber,
            email: updatedProfile.email,
            ficha: updatedProfile.ficha,
            programName: updatedProfile.programName,
            phone: updatedProfile.phone,
            city: updatedProfile.city,
            address: updatedProfile.address,
            gender: updatedProfile.gender,
            populationType: updatedProfile.populationType
          }
        : l
    );
    setCohortLearners(updatedCohort);

    if (isAutoSyncEnabled && (googleToken || googleUser)) {
      performFichaSync(updatedCohort, updatedProfile);
    }
  };

  const handleSignPact = (updatedProfile: ApprenticeProfile) => {
    const timestamp = new Date().toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    const withPact: ApprenticeProfile = {
      ...updatedProfile,
      hasSignedPact2026: true,
      pactSignedAt: timestamp
    };
    setApprentice(withPact);

    const updatedCohort = cohortLearners.map((l) =>
      l.id === updatedProfile.id
        ? {
            ...l,
            hasSignedPact2026: true,
            pactSignedAt: timestamp
          }
        : l
    );
    setCohortLearners(updatedCohort);

    if (isAutoSyncEnabled && (googleToken || googleUser)) {
      performFichaSync(updatedCohort, withPact);
    }
  };

  const hasPassed = evaluationResult?.passed ?? (apprentice.status === 'aprobado');

  const handleLogin = (selectedRole: Role, documentNumber?: string) => {
    setAuthRole(selectedRole);
    setViewedRole(selectedRole);
    setIsAuthenticated(true);

    if (selectedRole === 'learner') {
      const newProfile: ApprenticeProfile = {
        id: 'apr-' + Date.now(),
        fullName: '',
        documentType: 'CC',
        documentNumber: documentNumber || '',
        email: '',
        ficha: '',
        programName: '',
        regional: '',
        trainingCenter: '',
        inductionStartDate: new Date().toISOString().split('T')[0],
        status: 'en_induccion',
        completedModules: []
      };
      setApprentice(newProfile);
      setSelectedLearner(null);
      // Visualizar inmediatamente la ficha de caracterización vacía
      setTimeout(() => {
        setIsProfileModalOpen(true);
      }, 150);
    }
  };

  const handleResetRole = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div
      className={`min-h-screen bg-slate-100/80 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 ${
        isBlurringTheme ? 'theme-blur-active' : ''
      }`}
    >
      <Navbar
        currentRole={viewedRole}
        authRole={authRole}
        onToggleRole={() => {
          if (authRole === 'instructor') {
             // Cycle through views if instructor
             if (viewedRole === 'learner') setViewedRole('instructor');
             else if (viewedRole === 'instructor') setViewedRole('bienestar');
             else setViewedRole('learner');
          }
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        apprentice={apprentice}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        hasPassedEvaluation={hasPassed}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={() => setIsAuthenticated(false)}
        onResetRole={handleResetRole}
        onOpenManual={() => setIsManualModalOpen(true)}
        onOpenVideoTutorial={() => setIsVideoModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW SWITCHER */}
        {viewedRole === 'instructor' || viewedRole === 'bienestar' ? (
          <div className="space-y-4">
            {viewedRole === 'bienestar' && (
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Vista de Acompañamiento · Bienestar al Aprendiz</span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Consulta las fichas de caracterización demográfica, socioeconómica y el avance del Pacto de Convivencia de la ficha {apprentice.ficha || '2873190'}.
                  </span>
                </div>
              </div>
            )}
            <InstructorDashboard
              learners={cohortLearners}
              isReadOnly={viewedRole === 'bienestar'}
              onAddLearner={(newLearner) => {
                const updated = [newLearner, ...cohortLearners];
                setCohortLearners(updated);
                if (isAutoSyncEnabled) performFichaSync(updated);
              }}
              onEditLearner={(l) => {
                setSelectedLearner(l);
                setIsProfileModalOpen(true);
              }}
              currentFicha={apprentice.ficha || '2873190'}
              googleUser={googleUser}
              googleToken={googleToken}
              onGoogleAuthChange={(user, token) => {
                setGoogleUser(user);
                setGoogleToken(token);
                if (token) performFichaSync();
              }}
              onManualSync={() => performFichaSync()}
              lastSyncResult={lastSyncResult}
              isAutoSyncEnabled={isAutoSyncEnabled}
              onToggleAutoSync={handleToggleAutoSync}
            />
          </div>
        ) : (
          /* LEARNER VIEW */
          <div className="space-y-6">
            {/* Ficha de Caracterización Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#39A900]/10 dark:bg-[#39A900]/20 border border-[#39A900]/30 text-[#39A900] dark:text-[#4cd900] flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Ficha de Caracterización del Aprendiz
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Ficha {apprentice.ficha || '2873190'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {apprentice.fullName} · {apprentice.documentType} {apprentice.documentNumber} · {apprentice.programName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedLearner(null);
                  setIsProfileModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#39A900] hover:text-white dark:hover:bg-[#39A900] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#39A900] font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Ver / Diligenciar Ficha</span>
              </button>
            </div>

            {activeTab === 'modulos' && (
              <ModuleViewer
                completedModules={apprentice.completedModules}
                onToggleCompleteModule={handleToggleModuleComplete}
                onGoToEvaluation={() => setActiveTab('evaluacion')}
                onOpenPactModal={() => setIsPactModalOpen(true)}
                hasSignedPact={apprentice.hasSignedPact2026}
              />
            )}

            {activeTab === 'simbolos' && <InstitutionalSymbols />}

            {activeTab === 'derechos' && <RightsAndDutiesExplorer />}

            {activeTab === 'evaluacion' && (
              <InteractiveEvaluation
                apprentice={apprentice}
                onSaveResult={handleSaveEvaluationResult}
                onViewCertificate={() => setActiveTab('constancia')}
                onNavigateToModules={() => setActiveTab('modulos')}
                savedResult={evaluationResult}
              />
            )}

            {activeTab === 'constancia' && evaluationResult && (
              <OfficialCertificate
                apprentice={apprentice}
                result={evaluationResult}
                onBack={() => setActiveTab('evaluacion')}
              />
            )}

            {activeTab === 'constancia' && !evaluationResult && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4 shadow-sm">
                <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Constancia No Disponible Aún
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Para obtener tu constancia oficial expedida por el Centro de Formación, debes presentar y aprobar la <strong>Evaluación Oficial de Apropiación</strong> con un puntaje mínimo del 80%.
                </p>
                <button
                  onClick={() => setActiveTab('evaluacion')}
                  className="px-5 py-2.5 bg-[#39A900] hover:bg-[#2d7a04] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Presentar Evaluación Ahora
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Institutional SENA Footer (No-print) */}
      <footer className="no-print bg-slate-900 dark:bg-black text-slate-400 text-xs border-t border-slate-800 dark:border-slate-900 py-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800 dark:border-slate-800 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 p-1 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                <SenaLogo className="w-full h-full" variant="color" />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-wide block">
                  Servicio Nacional de Aprendizaje — SENA
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dirección General: Calle 57 No. 8 - 69 Bogotá D.C. (Cundinamarca), Colombia.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="text-[#39A900] dark:text-[#4cd900] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Manual del Aprendiz</span>
              </button>
              <span className="text-slate-600">·</span>
              <a
                href="https://portal.senasofiaplus.edu.co"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Portal SOFIA Plus</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://zajuna.sena.edu.co"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>LMS Zajuna</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">·</span>
              <a
                href="https://agenciapublicadeempleo.sena.edu.co"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Agencia de Empleo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Sistema de Gestión y Apropiación de Inducción del Aprendiz · Reglamento del Aprendiz SENA (Acuerdo 009 de 2024 con reformas 2026) · Decreto 0223 de 2026 (MinTrabajo).
            </p>
            <p>
              Línea Gratuita Nacional: 01 8000 910270 · Bogotá: +57 (601) 343 0111
            </p>
          </div>
        </div>
      </footer>

      {/* Ficha de Caracterización del Aprendiz Modal */}
      <LearnerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => { setIsProfileModalOpen(false); setSelectedLearner(null); }}
        profile={selectedLearner || apprentice}
        isInitialEntry={authRole === 'learner' && !selectedLearner}
        onSave={(updated) => {
          if (selectedLearner) {
            const updatedCohort = cohortLearners.map((l) => (l.id === updated.id ? updated : l));
            setCohortLearners(updatedCohort);
            setIsProfileModalOpen(false);
            setSelectedLearner(null);
            if (isAutoSyncEnabled && (googleToken || googleUser)) {
              performFichaSync(updatedCohort);
            }
          } else {
            handleSaveProfile(updated);
            setIsProfileModalOpen(false);
          }
        }}
      />

      {/* 2026 Pacto de Convivencia Modal */}
      <PactoConvivenciaModal
        isOpen={isPactModalOpen}
        onClose={() => setIsPactModalOpen(false)}
        apprentice={apprentice}
        onSignPact={handleSignPact}
      />

      {/* Manual de Usuario para Aprendices Modal */}
      <ManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {/* Video Tutorial Modal Flotante */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Floating Google Drive Sync Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 text-xs font-semibold">
          <div className="w-6 h-6 rounded-lg bg-[#39A900] flex items-center justify-center text-white shrink-0">
            <Cloud className="w-3.5 h-3.5" />
          </div>
          <span>{syncToast.message}</span>
        </div>
      )}
    </div>
  );
}
