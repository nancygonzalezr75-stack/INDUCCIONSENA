import React, { useState } from 'react';
import { INDUCTION_MODULES } from '../data/inductionContent';
import { InductionModule, InductionTopic } from '../types/induction';
import { Updates2026Banner } from './Updates2026Banner';
import { Landmark, Scale, Compass, HeartHandshake, Laptop, CheckCircle2, Circle, Clock, BookOpen, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface ModuleViewerProps {
  completedModules: string[];
  onToggleCompleteModule: (moduleId: string) => void;
  onGoToEvaluation: () => void;
  onOpenPactModal?: () => void;
  hasSignedPact?: boolean;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  completedModules,
  onToggleCompleteModule,
  onGoToEvaluation,
  onOpenPactModal = () => {},
  hasSignedPact = false
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(INDUCTION_MODULES[0].id);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  const activeModule = INDUCTION_MODULES.find((m) => m.id === selectedModuleId) || INDUCTION_MODULES[0];
  const activeTopic = activeModule.topics[activeTopicIndex] || activeModule.topics[0];
  const isModuleCompleted = completedModules.includes(activeModule.id);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#39A900] dark:text-[#4cd900]" />;
    }
  };

  const handleNextTopic = () => {
    if (activeTopicIndex < activeModule.topics.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    } else {
      const currentModIdx = INDUCTION_MODULES.findIndex((m) => m.id === activeModule.id);
      if (currentModIdx < INDUCTION_MODULES.length - 1) {
        setSelectedModuleId(INDUCTION_MODULES[currentModIdx + 1].id);
        setActiveTopicIndex(0);
      }
    }
  };

  const handlePrevTopic = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(activeTopicIndex - 1);
    } else {
      const currentModIdx = INDUCTION_MODULES.findIndex((m) => m.id === activeModule.id);
      if (currentModIdx > 0) {
        const prevMod = INDUCTION_MODULES[currentModIdx - 1];
        setSelectedModuleId(prevMod.id);
        setActiveTopicIndex(prevMod.topics.length - 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 2026 Regulatory Updates Banner */}
      <Updates2026Banner
        onOpenPactModal={onOpenPactModal}
        hasSignedPact={hasSignedPact}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar: Module Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Ruta de Inducción SENA</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedModules.length} de {INDUCTION_MODULES.length} módulos completados
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#39A900] dark:text-[#4cd900]">
                  {Math.round((completedModules.length / INDUCTION_MODULES.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-5">
              <div
                className="bg-[#39A900] dark:bg-[#4cd900] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(completedModules.length / INDUCTION_MODULES.length) * 100}%`
                }}
              />
            </div>

            <div className="space-y-2">
              {INDUCTION_MODULES.map((mod, idx) => {
                const isSelected = mod.id === activeModule.id;
                const isCompleted = completedModules.includes(mod.id);

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setActiveTopicIndex(0);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 ring-1 ring-emerald-400 dark:ring-emerald-600'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
                      {getModuleIcon(mod.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {mod.estimatedMinutes} min
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {mod.topics.length} temas clave
                      </p>
                    </div>

                    <div className="shrink-0 self-center">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-[#4cd900]" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onGoToEvaluation}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ir a Evaluación de Apropiación</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            {/* Module Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
                  <span>Módulo 0{activeModule.order}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModule.category.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModule.estimatedMinutes} minutos</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeModule.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {activeModule.shortDescription}
                </p>
              </div>

              <button
                onClick={() => onToggleCompleteModule(activeModule.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 ${
                  isModuleCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isModuleCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400'}`} />
                {isModuleCompleted ? 'Módulo Completado' : 'Marcar como Completado'}
              </button>
            </div>

            {/* Topics Sub-navigation */}
            <div className="my-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
              {activeModule.topics.map((top, idx) => (
                <button
                  key={top.id}
                  onClick={() => setActiveTopicIndex(idx)}
                  className={`pb-2.5 px-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                    idx === activeTopicIndex
                      ? 'border-[#39A900] dark:border-[#4cd900] text-slate-900 dark:text-white font-bold'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Tema {idx + 1}: {top.title}</span>
                  {top.isUpdate2026 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400">
                      2026
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content Container */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
              {/* Active Topic Detail */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeTopic.title}
                    </h3>
                    {activeTopic.badgeText && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        {activeTopic.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {activeTopic.summary}
                  </p>
                </div>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeTopic.content.map((p, pIdx) => (
                  <p key={pIdx} className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {p}
                  </p>
                ))}
              </div>

              {/* Key Points Box */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-800/60">
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-[#4cd900]" />
                  Puntos Esenciales para la Evaluación de Apropiación
                </h4>
                <ul className="space-y-2">
                  {activeTopic.keyPoints.map((kp, kpIdx) => (
                    <li key={kpIdx} className="text-xs text-emerald-900 dark:text-emerald-100 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] dark:bg-[#4cd900] shrink-0 mt-1.5" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Legal / Policy Reference */}
            {activeTopic.legalReference && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Marco Legal o Normativo:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{activeTopic.legalReference}</span>
              </div>
            )}
          </div>

          {/* Topic Navigation controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrevTopic}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Anterior
            </button>
            <button
              onClick={handleNextTopic}
              className="px-4 py-2 text-xs font-medium text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              Siguiente
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
