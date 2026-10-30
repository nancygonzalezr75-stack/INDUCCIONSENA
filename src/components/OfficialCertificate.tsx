import React from 'react';
import { ApprenticeProfile, EvaluationResult } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface OfficialCertificateProps {
  apprentice: ApprenticeProfile;
  result: EvaluationResult;
  onBack: () => void;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  apprentice,
  result,
  onBack
}) => {
  const certificateCode = result.certificateCode || `SENA-IND-${apprentice.ficha}-982715`;
  const issueDate = result.completedAt || new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden during print) */}
      <div className="no-print bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la Evaluación
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d7a04] rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="bg-white p-6 sm:p-12 rounded-3xl border-4 border-emerald-700/80 shadow-xl max-w-4xl mx-auto relative overflow-hidden print:p-8 print:border-4 print:shadow-none print:max-w-none print:w-full">
        {/* Subtle decorative security borders */}
        <div className="absolute inset-2 border-2 border-dashed border-emerald-300 pointer-events-none rounded-2xl" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Official SENA Logo Watermark in center background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
          <SenaLogo className="w-96 h-96" variant="color" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col items-center text-center relative z-10 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <SenaLogo className="w-20 h-20" variant="color" />
          </div>
          <span className="text-[10px] tracking-[0.25em] font-extrabold text-slate-500 uppercase">
            República de Colombia · Ministerio del Trabajo
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase mt-1">
            Servicio Nacional de Aprendizaje — SENA
          </h1>
          <span className="text-xs font-medium text-slate-600 mt-0.5">
            {apprentice.regional} · {apprentice.trainingCenter}
          </span>
        </div>

        {/* Certificate Body */}
        <div className="py-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-widest border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Constancia Oficial de Apropiación de Inducción · Acuerdo 009 de 2024</span>
          </div>

          <p className="text-sm text-slate-600 font-serif italic max-w-xl mx-auto">
            El Centro de Formación certifica que el aprendiz:
          </p>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wide font-serif">
              {apprentice.fullName}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Identificado(a) con {apprentice.documentType} No. {apprentice.documentNumber}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Cumplió satisfactoriamente con la totalidad de los módulos de la <strong>Ruta de Inducción Institucional</strong>, demostrando apropiación y dominio de los valores institucionales, el <strong>Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)</strong>, sus derechos, deberes y garantías procesales (Art. 48), y la normatividad de prácticas formativas y contrato de aprendizaje bajo la <strong>Ley 789 de 2002 y el Decreto 1072 de 2015</strong>, alcanzando una calificación de:
          </p>

          <div className="inline-flex items-center gap-4 bg-slate-50 px-6 py-2.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#39A900]" />
              <span className="text-sm font-bold text-slate-800">
                Puntaje de Evaluación:
              </span>
            </div>
            <span className="text-xl font-extrabold text-[#39A900]">
              {result.score}% (Aprobado)
            </span>
          </div>

          {apprentice.hasSignedPact2026 && (
            <div className="max-w-md mx-auto p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[11px] font-bold text-emerald-900">
                ✓ Compromiso Institucional y Pacto de Convivencia Suscrito Digitalmente (Acuerdo 009 de 2024)
              </span>
            </div>
          )}

          <div className="pt-2 text-xs text-slate-500 max-w-md mx-auto">
            <p><strong>Programa:</strong> {apprentice.programName}</p>
            <p className="mt-0.5"><strong>Ficha de Caracterización:</strong> {apprentice.ficha}</p>
          </div>
        </div>

        {/* Signatures & Security Validation */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10">
          {/* Instructor Signature */}
          <div className="text-center sm:text-left space-y-1">
            <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto sm:mx-0 flex items-center justify-center font-serif italic text-xs text-slate-700">
              Prof. Nancy González R.
            </div>
            <p className="text-[11px] font-bold text-slate-900">Instructor Líder de Inducción</p>
            <p className="text-[10px] text-slate-500">Equipo de Bienestar al Aprendiz</p>
          </div>

          {/* Subdirector Signature */}
          <div className="text-center space-y-1">
            <div className="h-10 border-b border-slate-400 max-w-[200px] mx-auto flex items-center justify-center font-serif italic text-xs text-slate-700">
              Dr. Germán Osorio P.
            </div>
            <p className="text-[11px] font-bold text-slate-900">Subdirector de Centro</p>
            <p className="text-[10px] text-slate-500">Ordenador de Gasto y Formación</p>
          </div>

          {/* QR Verification Box */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
            {/* SVG QR Code Simulation */}
            <div className="w-20 h-20 p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs flex items-center justify-center mb-1">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#ffffff" />
                {/* 3 Position Corners */}
                <rect x="5" y="5" width="28" height="28" fill="#0f172a" />
                <rect x="9" y="9" width="20" height="20" fill="#ffffff" />
                <rect x="13" y="13" width="12" height="12" fill="#39A900" />

                <rect x="67" y="5" width="28" height="28" fill="#0f172a" />
                <rect x="71" y="9" width="20" height="20" fill="#ffffff" />
                <rect x="75" y="13" width="12" height="12" fill="#39A900" />

                <rect x="5" y="67" width="28" height="28" fill="#0f172a" />
                <rect x="9" y="71" width="20" height="20" fill="#ffffff" />
                <rect x="13" y="75" width="12" height="12" fill="#39A900" />

                {/* Data modules */}
                <rect x="40" y="10" width="8" height="8" fill="#0f172a" />
                <rect x="52" y="15" width="8" height="8" fill="#0f172a" />
                <rect x="45" y="45" width="12" height="12" fill="#39A900" />
                <rect x="15" y="42" width="8" height="8" fill="#0f172a" />
                <rect x="65" y="45" width="8" height="8" fill="#0f172a" />
                <rect x="42" y="70" width="8" height="8" fill="#0f172a" />
                <rect x="75" y="75" width="10" height="10" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-700 block">
              {certificateCode}
            </span>
            <span className="text-[8px] text-slate-500 block">
              Verificable en SOFIA Plus · {issueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
