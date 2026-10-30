import React, { useState } from 'react';
import { ApprenticeProfile, CohortLearner } from '../types/induction';
import { X, User, Check, ClipboardList, Shield, Building2, MapPin, Sparkles } from 'lucide-react';

interface LearnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile | CohortLearner;
  onSave: (updated: any) => void;
  isInitialEntry?: boolean;
}

export const LearnerProfileModal: React.FC<LearnerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  isInitialEntry = false
}) => {
  const [formData, setFormData] = useState<any>({ ...profile });
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  React.useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors my-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 px-6 py-5 flex items-center justify-between text-white border-b-2 border-[#39A900]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#39A900] flex items-center justify-center text-white shadow-md shadow-[#39A900]/30 shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Ficha de Caracterización del Aprendiz SENA
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#39A900]/30 text-[#4cd900] border border-[#39A900]/50 px-2 py-0.5 rounded-full">
                  Ficha {formData.ficha || '2873190'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Formulario Oficial de Ingreso · Datos registrados para matrícula, bienestar y certificación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Welcoming Guidance Banner for Apprentices */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/60 p-4 px-6 flex items-start gap-3 text-xs text-emerald-950 dark:text-emerald-100">
          <div className="w-5 h-5 rounded-full bg-[#39A900] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3 h-3" />
          </div>
          <div>
            <span className="font-bold block text-emerald-900 dark:text-emerald-200">
              {isInitialEntry
                ? '¡Bienvenido a tu Proceso de Inducción SENA!'
                : 'Ficha de Información y Caracterización del Aprendiz'}
            </span>
            <p className="text-emerald-800 dark:text-emerald-300 text-[11.5px] mt-0.5 leading-relaxed">
              Verifica y completa los siguientes campos de tu ficha de caracterización. Esta información es obligatoria para validar tu matrícula, permitir el acompañamiento de Bienestar al Aprendiz y emitir tu constancia de inducción aprobada.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Seccion 1: Identificación Personal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-[#39A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Identificación del Aprendiz
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Completo del Aprendiz <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                placeholder="Ej. Valentina Restrepo Morales"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo Doc. <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.documentType || 'CC'}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                  <option value="TI">Tarjeta de Identidad (T.I.)</option>
                  <option value="CE">Cédula de Extranjería (C.E.)</option>
                  <option value="PEP">Permiso Especial Permanencia (P.E.P.)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Documento <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.documentNumber || ''}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="1020485921"
                />
              </div>
            </div>
          </div>

          {/* Seccion 2: Datos de Formación y Ficha */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Building2 className="w-4 h-4 text-[#39A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Información del Programa y Ficha
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Ficha <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.ficha || '2873190'}
                  onChange={(e) => setFormData({ ...formData, ficha: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="2873190"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Programa de Formación <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.programName || ''}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="Análisis y Desarrollo de Software (ADSO)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Regional SENA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.regional || 'Regional Distrito Capital'}
                  onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="Regional Distrito Capital"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Centro de Formación <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.trainingCenter || 'Centro de Gestión de Mercados, Logística y TIC'}
                  onChange={(e) => setFormData({ ...formData, trainingCenter: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="Centro de Gestión de Mercados, Logística y TIC"
                />
              </div>
            </div>
          </div>

          {/* Seccion 3: Datos de Contacto y Ubicación */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-[#39A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Datos de Contacto y Residencia
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Institucional <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="aprendiz@soy.sena.edu.co"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono Celular de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="314 000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ciudad / Municipio de Residencia
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="Bogotá D.C."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección de Residencia
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  placeholder="Calle 123 # 45 - 67"
                />
              </div>
            </div>
          </div>

          {/* Seccion 4: Caracterización Demográfica y Socioeconómica */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <Shield className="w-4 h-4 text-[#39A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. Caracterización Socioeconómica y Poblacional
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Identidad de Género
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  <option value="">Seleccionar género...</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="no_binario">No binario</option>
                  <option value="otro">Otro / Prefiero no decir</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Grupo Poblacional / Étnico
                </label>
                <select
                  value={formData.populationType || 'general'}
                  onChange={(e) => setFormData({ ...formData, populationType: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  <option value="general">Población General</option>
                  <option value="victima">Víctima del Conflicto Armado</option>
                  <option value="discapacidad">Persona con Discapacidad</option>
                  <option value="afrodescendiente">Afrocolombiano / Raizal / Palenquero</option>
                  <option value="indigena">Indígena</option>
                  <option value="campesino">Campesino(a)</option>
                  <option value="madre_cabeza">Madre / Padre Cabeza de Familia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              * Campos obligatorios para el registro oficial
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#39A900]/20"
              >
                <Check className="w-4 h-4" />
                <span>{isInitialEntry ? 'Guardar Ficha y Continuar a la Inducción' : 'Guardar y Actualizar Ficha'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

