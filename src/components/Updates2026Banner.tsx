import React, { useState } from 'react';
import { Sparkles, Scale, Briefcase, FileSignature, ChevronDown, ChevronUp, ShieldCheck, Check } from 'lucide-react';

interface Updates2026BannerProps {
  onOpenPactModal: () => void;
  hasSignedPact?: boolean;
}

export const Updates2026Banner: React.FC<Updates2026BannerProps> = ({
  onOpenPactModal,
  hasSignedPact
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-emerald-500/30 shadow-md relative overflow-hidden transition-all">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#39A900] text-slate-950 shadow-xs">
              <Sparkles className="w-3 h-3" />
              Normatividad Vigente
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Reglamento del Aprendiz SENA · Acuerdo 009 de 2024
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Marco Normativo Institucional: Acuerdo 009 de 2024 y Etapa Productiva
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Apropia las directrices vigentes: el enfoque pedagógico del Comité de Evaluación (Art. 48), las garantías en etapa productiva (Ley 789 de 2002 y Dec. 1072 de 2015), el uso ético en Zajuna y el Compromiso del Aprendiz.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <span>Ocultar detalles</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Ver pilares normativos</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={onOpenPactModal}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
              hasSignedPact
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-[#39A900] hover:bg-[#2d7a04] text-white shadow-xs'
            }`}
          >
            {hasSignedPact ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4cd900]" />
                <span>Compromiso Suscrito</span>
              </>
            ) : (
              <>
                <FileSignature className="w-3.5 h-3.5" />
                <span>Firmar Compromiso</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Accordion Details */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10 text-xs">
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-2 text-[#4cd900] font-bold">
              <Briefcase className="w-4 h-4" />
              <span>Etapa Productiva (Ley 789/2002 y Dec. 1072/2015)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Modalidades oficiales reguladas (Contrato de Aprendizaje, Vínculo Laboral, Proyecto, Pasantía). Exige <strong>tutor asignado</strong>, concertación de plan formativo y afiliación obligatoria a ARL por la empresa patrocinadora desde el día uno.
            </p>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Scale className="w-4 h-4" />
              <span>Comité de Evaluación (Acuerdo 009 de 2024, Art. 48)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Instancia paritaria con participación del <strong>vocero de aprendices</strong>. Primacía estricta de medidas pedagógicas (Planes de Mejoramiento obligatorios antes de contemplar sanciones) y citación formal a @soy.sena.edu.co.
            </p>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Zajuna y Ética Digital Institucional</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Entorno virtual de aprendizaje oficial para evidencias y bitácoras. Directrices para el <strong>uso ético y transparente de tecnologías e Inteligencia Artificial</strong>, tipificando el plagio no citado como falta disciplinaria (Art. 9º).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
