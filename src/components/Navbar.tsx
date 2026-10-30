import React from 'react';
import { ApprenticeProfile, Role } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { BookOpen, Shield, Scale, Award, Users, UserCheck, Edit3, Sun, Moon, Play } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  authRole: Role;
  onToggleRole: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  apprentice: ApprenticeProfile;
  onOpenProfileModal: () => void;
  hasPassedEvaluation: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onResetRole: () => void;
  onOpenManual?: () => void;
  onOpenVideoTutorial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  authRole,
  onToggleRole,
  activeTab,
  onSelectTab,
  apprentice,
  onOpenProfileModal,
  hasPassedEvaluation,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  onResetRole,
  onOpenManual,
  onOpenVideoTutorial
}) => {
  return (
    <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      {/* Top Colombian Institutional Ribbon */}
      <div className="h-1 bg-gradient-to-r from-[#39A900] via-[#2d7a04] to-[#1e5302]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & SENA Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-xs">
              <SenaLogo className="w-full h-full" variant="color" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">SENA</span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden sm:inline">
                  Servicio Nacional de Aprendizaje
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#39A900] dark:text-[#4cd900] leading-none">
                Sistema Integral de Inducción de Aprendices
              </p>
            </div>
          </div>

          {/* Apprentice identity chip with edit trigger */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
                <span>{apprentice.fullName}</span>
                <button
                  onClick={onOpenProfileModal}
                  className="text-slate-400 hover:text-[#39A900] dark:hover:text-[#4cd900] transition-colors"
                  title="Editar datos del aprendiz"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Ficha {apprentice.ficha} · {apprentice.programName.split('(')[1]?.replace(')', '') || 'ADSO'}
              </div>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                apprentice.status === 'aprobado'
                  ? 'bg-[#39A900]'
                  : apprentice.status === 'requiere_refuerzo'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              title={`Estado: ${apprentice.status}`}
            />
          </div>

          {/* Controls: Role Switcher & Dark Mode Toggle on the right */}
          <div className="flex items-center gap-2">
            {/* Video Tutorial */}
            {onOpenVideoTutorial && (
              <button
                onClick={onOpenVideoTutorial}
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-[#39A900] hover:text-white dark:hover:text-white transition-all shadow-2xs group cursor-pointer"
                title="Reproducir Video Tutorial del Boot Camp"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#39A900] group-hover:text-white dark:text-[#4cd900]" />
                <span className="hidden sm:inline">Video Tutorial</span>
              </button>
            )}

            {/* Manual de Usuario para Aprendices */}
            {onOpenManual && (
              <button
                onClick={onOpenManual}
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all shadow-2xs"
                title="Abrir Manual de Usuario para Aprendices"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
                <span className="hidden sm:inline">Manual</span>
              </button>
            )}

            {/* Cambiar de Módulo (Regresa a selección de roles) */}
            <button
              onClick={onResetRole}
              className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              title="Cambiar de módulo"
            >
              <span>Cambiar Módulo</span>
            </button>

            <button
              onClick={authRole === 'instructor' ? onToggleRole : undefined}
              disabled={authRole !== 'instructor'}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                authRole !== 'instructor' ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                currentRole === 'instructor'
                  ? 'bg-slate-900 dark:bg-emerald-950 text-white border-slate-900 dark:border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {currentRole === 'instructor' ? (
                <>
                  <Users className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
                  <span>Panel Instructor</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
                  <span>Modo {currentRole === 'learner' ? 'Aprendiz' : 'Bienestar'}</span>
                </>
              )}
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDarkMode
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
              }`}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-xs font-bold shadow-md shadow-red-500/20"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Navigation Tabs (For Learner Mode) */}
        {currentRole === 'learner' ? (
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => onSelectTab('modulos')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'modulos'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Ruta de Inducción
            </button>

            <button
              onClick={() => onSelectTab('simbolos')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'simbolos'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Símbolos e Identidad
            </button>

            <button
              onClick={() => onSelectTab('derechos')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'derechos'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Derechos y Deberes
            </button>

            <button
              onClick={() => onSelectTab('evaluacion')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'evaluacion'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Evaluación de Apropiación
            </button>

            {hasPassedEvaluation && (
              <button
                onClick={() => onSelectTab('constancia')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap animate-pulse ${
                  activeTab === 'constancia'
                    ? 'bg-[#39A900] dark:bg-[#2d7a04] text-white font-bold'
                    : 'bg-emerald-100/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 font-semibold hover:bg-emerald-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Mi Constancia Oficial
              </button>
            )}
          </nav>
        ) : currentRole === 'bienestar' ? (
          <div className="py-2 px-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
            Vista exclusiva Bienestar al Aprendiz · Gestión de Fichas de Caracterización
          </div>
        ) : null}
      </div>
    </header>
  );
};
