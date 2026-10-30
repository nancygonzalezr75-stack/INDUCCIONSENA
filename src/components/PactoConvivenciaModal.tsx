import React, { useState } from 'react';
import { ApprenticeProfile } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { FileText, CheckCircle2, ShieldCheck, X, Award, AlertCircle, Stamp } from 'lucide-react';

interface PactoConvivenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  apprentice: ApprenticeProfile;
  onSignPact: (apprentice: ApprenticeProfile) => void;
}

export const PactoConvivenciaModal: React.FC<PactoConvivenciaModalProps> = ({
  isOpen,
  onClose,
  apprentice,
  onSignPact
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signatureName, setSignatureName] = useState(apprentice.fullName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    const currentDate = new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const updated: ApprenticeProfile = {
      ...apprentice,
      hasSignedPact2026: true,
      pactSignedAt: currentDate
    };

    setTimeout(() => {
      onSignPact(updated);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 my-8 overflow-hidden transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white border-b-2 border-[#39A900] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <SenaLogo className="w-10 h-10" variant="white" />
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-[#4cd900] uppercase block">
                Dirección de Formación Profesional · Acuerdo 009 de 2024
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Pacto de Convivencia y Compromiso Institucional del Aprendiz
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            Suscripción obligatoria del compromiso ético y formativo para la legalización de la matrícula, fundamentado en el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), la Ley 789 de 2002 y el Decreto 1072 de 2015.
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#39A900] dark:text-[#4cd900] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-emerald-950 dark:text-emerald-200">
              <strong>Aprendiz:</strong> {apprentice.fullName} | <strong>Documento:</strong> {apprentice.documentType} No. {apprentice.documentNumber} | <strong>Ficha:</strong> {apprentice.ficha} | <strong>Programa:</strong> {apprentice.programName}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                1. Apropiación y Respeto Normativo (Acuerdo 009 de 2024)
              </h4>
              <p className="leading-relaxed">
                Me comprometo a conocer, cumplir y defender el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024). Respetaré los deberes (Art. 8º), portando de forma permanente y visible el carné institucional y justificando cualquier inasistencia por escrito dentro de los 3 días hábiles siguientes ante mi instructor con los soportes de ley.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                2. Debido Proceso y Primacía Formativa (Acuerdo 009 de 2024, Art. 48)
              </h4>
              <p className="leading-relaxed">
                Reconozco el rol del Comité de Evaluación y Seguimiento paritario de mi centro formativo, cuyo propósito esencial es pedagógico y formativo. Me comprometo a cumplir estrictamente los Planes de Mejoramiento concertados y revisar mi correo institucional @soy.sena.edu.co para todas las notificaciones oficiales vinculantes.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                3. Prácticas Formativas y Etapa Productiva (Ley 789 de 2002 y Decreto 1072 de 2015)
              </h4>
              <p className="leading-relaxed">
                Asumo con madurez y profesionalismo el cumplimiento de mi etapa productiva en cualquiera de las modalidades oficiales reconocidas, concertando el plan formativo con el tutor designado por la empresa co-formadora, registrando bitácoras de seguimiento periódicas en Zajuna y acatando los protocolos de Seguridad y Salud en el Trabajo (SG-SST).
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                4. Convivencia, Ética Digital y Uso Responsable de Tecnologías
              </h4>
              <p className="leading-relaxed">
                Haré uso ético y honesto de los ambientes virtuales (Zajuna) y herramientas tecnológicas. Declaro que citaré toda fuente y herramienta utilizada, rechazando el plagio, la suplantación o cualquier manifestación de ciberacoso en los canales de aprendizaje de acuerdo con el régimen de faltas institucionales.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                5. Cuidado de Bienes Públicos y Convivencia Armónica
              </h4>
              <p className="leading-relaxed">
                Protegeré la infraestructura física, maquinaria, herramientas y software de mi Centro de Formación, promoviendo un ambiente incluyente, respetuoso con la diversidad y libre de discriminación o violencia.
              </p>
            </div>
          </div>

          {/* Already signed banner or signing form */}
          {apprentice.hasSignedPact2026 ? (
            <div className="p-4 bg-emerald-100/70 dark:bg-emerald-950/80 rounded-2xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stamp className="w-8 h-8 text-[#39A900] dark:text-[#4cd900]" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-wide">
                    Compromiso Suscrito y Matrícula Legalizada
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Firmado digitalmente: {apprentice.pactSignedAt || 'Vigente'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-bold text-[#39A900] border border-emerald-200 dark:border-emerald-700">
                ACUERDO 009 DE 2024
              </span>
            </div>
          ) : (
            <form onSubmit={handleSign} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#39A900] focus:ring-[#39A900]"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  He leído, comprendido y acepto formalmente los 5 compromisos del <strong>Pacto de Convivencia y Compromiso Institucional</strong> y ratifico mi acatamiento al Reglamento del Aprendiz SENA (Acuerdo 009 de 2024).
                </span>
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Firma Digital del Aprendiz (Nombre Completo)
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!acceptedTerms || isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Registrando...' : 'Firmar y Legalizar Matrícula'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
