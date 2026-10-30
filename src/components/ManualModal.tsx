import React, { useState } from 'react';
import { BookOpen, X, Search, CheckCircle2, Award, Scale, Compass, HeartHandshake, Shield, FileText, Download } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const sections = [
    { id: 'intro', title: '1. Objetivo del Portal', icon: BookOpen },
    { id: 'acceso', title: '2. Acceso y Perfil', icon: FileText },
    { id: 'modulos', title: '3. Los 4 Módulos Formativos', icon: Compass },
    { id: 'herramientas', title: '4. Símbolos y Pacto Ético', icon: Shield },
    { id: 'reglamento', title: '5. Reglamento (Acuerdo 009/2024)', icon: Scale },
    { id: 'evaluacion', title: '6. Evaluación y Retroalimentación', icon: CheckCircle2 },
    { id: 'constancia', title: '7. Constancia Oficial con QR', icon: Award },
    { id: 'drive', title: '8. Sincronización y Drive', icon: HeartHandshake }
  ];

  const handleDownloadMarkdown = () => {
    const link = document.createElement('a');
    link.href = '/manual.md';
    link.download = 'manual_induccion_sena.md';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#39A900] text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Manual de Usuario para Aprendices
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Acuerdo 009 de 2024
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guía completa de uso del Sistema Integral de Inducción SENA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Descargar archivo manual en Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar Manual</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en el manual (ej: carné, inasistencia, evaluación, QR, etapas)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-hidden text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Body: Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation Sidebar */}
          <div className="w-48 sm:w-60 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 space-y-1 overflow-y-auto shrink-0 text-xs">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    activeSection === sec.id
                      ? 'bg-[#39A900] text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            
            {activeSection === 'intro' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base mb-1">
                    ¡Bienvenido a la Inducción SENA!
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Este aplicativo web ha sido diseñado para que conozcas la institución más querida por los colombianos, tus derechos, deberes y la ruta formativa que te preparará como profesional integral.
                  </p>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Objetivos de la herramienta:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Apropiar el Reglamento del Aprendiz:</strong> Conoce a fondo el Acuerdo 009 de 2024 para ejercer una ciudadanía ética y responsable.</li>
                  <li><strong>Comprender la Formación Profesional Integral:</strong> Conocer las etapas lectiva y productiva, plataformas (SOFIA Plus y Zajuna), y servicios de Bienestar.</li>
                  <li><strong>Evaluar tu aprendizaje:</strong> Desarrollar la prueba interactiva con retroalimentación formativa inmediata (mínimo 70% de aprobación).</li>
                  <li><strong>Certificación oficial:</strong> Descargar la constancia de inducción oficial con código QR institucional verificable.</li>
                </ul>
              </div>
            )}

            {activeSection === 'acceso' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Acceso y Ficha de Caracterización de Ingreso</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Al ingresar con el rol <strong>&quot;Rol de Aprendiz&quot;</strong>, el sistema despliega automáticamente el formulario oficial de la <strong>Ficha de Caracterización</strong> para que sea diligenciado de inmediato:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-900 dark:text-white mb-1">1. Identificación y Documento</strong>
                    <p className="text-slate-500 dark:text-slate-400">Verifica tu Tipo y Número de Documento (C.C., T.I., etc.) y tu Nombre Completo registrado.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-900 dark:text-white mb-1">2. Número de Ficha y Programa</strong>
                    <p className="text-slate-500 dark:text-slate-400">Código de tu ficha (ej. 2873190), programa de formación, Regional y Centro de Formación.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-900 dark:text-white mb-1">3. Contacto y Residencia</strong>
                    <p className="text-slate-500 dark:text-slate-400">Correo institucional (@soy.sena.edu.co), teléfono móvil y ciudad de residencia.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong className="block text-slate-900 dark:text-white mb-1">4. Información Demográfica</strong>
                    <p className="text-slate-500 dark:text-slate-400">Género y tipo de población para acompañamiento de Bienestar al Aprendiz.</p>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                  📋 <strong>Actualizaciones posteriores:</strong> Puedes reabrir y actualizar tu ficha en cualquier momento haciendo clic en el banner superior de caracterización o en el lápiz junto a tu nombre en la barra de navegación.
                </div>
              </div>
            )}

            {activeSection === 'modulos' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Los 4 Módulos de la Ruta de Inducción</h3>
                <div className="space-y-3">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs">Módulo 1: Identidad, Valores y Símbolos del SENA</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Historia del SENA (fundado en 1957 por Rodolfo Martínez Tono), Misión y Visión, Escudo con los 3 sectores de la economía, Bandera de la paz, Logo-símbolo e Himno del SENA.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs">Módulo 2: Reglamento del Aprendiz (Acuerdo 009 de 2024)</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Derechos (Art. 5º), Deberes (Art. 8º: porte de carné, justificación en 3 días hábiles), Prohibiciones (Art. 9º), Comité de Evaluación y Seguimiento (Art. 48: primacía formativa y correo @soy.sena.edu.co), y ética en el uso de IA.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs">Módulo 3: Ruta de Formación y Novedades del Aprendiz</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Etapa Lectiva y modalidades de Etapa Productiva (Contrato de aprendizaje, Vínculo laboral, Proyecto, Pasantía, Monitoría). Novedades: traslados, aplazamientos y régimen de deserción (3 días consecutivos injustificados).
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/30">
                    <h5 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs">Módulo 4: Bienestar al Aprendiz y Liderazgo</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Salud integral, deporte, cultura, acompañamiento psicológico, apoyos socioeconómicos (FIC, sostenimiento, alimentación), elección de voceros de ficha y servicios de biblioteca/APE.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'herramientas' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Símbolos Institucionales y Pacto Ético</h3>
                <p className="text-xs">
                  La plataforma incluye herramientas audiovisuales para vivir la identidad SENA:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Reproductor del Himno del SENA:</strong> Escucha el himno oficial con letra interactiva para aprenderlo y entonarlo en eventos formales.</li>
                  <li><strong>Heráldica del Escudo:</strong> Conoce el café y las espigas (sector primario), la rueda dentada (sector industrial) y el caduceo (sector servicios y comercio).</li>
                  <li><strong>Pacto de Convivencia y Compromiso Ético:</strong> Firma digitalmente tu compromiso con los valores institucionales y la cultura de paz.</li>
                </ul>
              </div>
            )}

            {activeSection === 'reglamento' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Reglamento del Aprendiz — Acuerdo 009 de 2024</h3>
                <div className="space-y-2 text-xs">
                  <p>
                    El <strong>Acuerdo 009 de 2024</strong> es la norma rectora de los aprendices en todas las sedes del país.
                  </p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <strong className="text-slate-900 dark:text-white block">Puntos esenciales que debes recordar:</strong>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                      <li><strong>Porte del Carné:</strong> Obligatorio y visible al ingresar y permanecer en cualquier centro o subsede SENA.</li>
                      <li><strong>Justificación de Inasistencias:</strong> Tienes hasta <strong>3 días hábiles</strong> para radicar soportes válidos (incapacidad EPS o fuerza mayor).</li>
                      <li><strong>Deserción:</strong> Se configura tras 3 días hábiles consecutivos sin asistir ni justificar formalmente.</li>
                      <li><strong>Comité de Evaluación (Art. 48):</strong> Antes de recomendar sanciones, debe agotar un Plan de Mejoramiento pedagógico.</li>
                      <li><strong>Correo @soy.sena.edu.co:</strong> Medio oficial para citaciones vinculantes con 3 días hábiles de anticipación.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'evaluacion' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Evaluación de Apropiación del Conocimiento</h3>
                <p className="text-xs">
                  Para medir tu comprensión, presentarás una prueba de 10 casos prácticos:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <strong className="text-emerald-900 dark:text-emerald-200 block mb-1">Aprobación mínima: 70%</strong>
                    <p className="text-emerald-800 dark:text-emerald-300">
                      Debes acertar al menos 7 de las 10 preguntas. Si no lo logras, puedes revisar los módulos y reintentar.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <strong className="text-slate-900 dark:text-white block mb-1">Retroalimentación Formativa Inmediata</strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Cada pregunta muestra la respuesta correcta, la justificación pedagógica y el artículo del reglamento que sustenta la decisión.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'constancia' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Constancia Oficial con Código QR</h3>
                <p className="text-xs">
                  Al aprobar la evaluación con 70% o más, se activa la pestaña <strong>&quot;Mi Constancia Oficial&quot;</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Validación por QR:</strong> Incluye un código QR que cualquier instructor o directivo puede escanear con su teléfono para verificar la autenticidad de tu constancia.</li>
                  <li><strong>Descarga en PDF:</strong> Pulsa el botón &quot;Imprimir / Guardar en PDF&quot;, elige orientación Horizontal y activa los gráficos de fondo para archivar tu constancia en alta resolución.</li>
                </ul>
              </div>
            )}

            {activeSection === 'drive' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Sincronización Institucional con Google Drive</h3>
                <p className="text-xs">
                  Tus respuestas y resultados se sincronizan automáticamente con la cuenta de Google Drive institucional del instructor en la carpeta <strong>BOOT CAMP INDUCCIÓN</strong>.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <p><strong>Estructura del libro por Ficha:</strong></p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
                    <li><em>Pestaña 1 (Caracterización):</em> Datos personales, documento y correo.</li>
                    <li><em>Pestaña 2 (Módulos):</em> Módulos estudiados y porcentaje de avance.</li>
                    <li><em>Pestaña 3 (Evaluación):</em> Calificación numérica, estado de aprobación y fecha.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Servicio Nacional de Aprendizaje SENA · Documento de referencia: /MANUAL.md</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#39A900] hover:bg-[#2d7a04] text-white font-bold rounded-lg transition-colors shadow-2xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
