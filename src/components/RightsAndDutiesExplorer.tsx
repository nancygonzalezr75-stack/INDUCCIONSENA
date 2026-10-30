import React, { useState, useMemo } from 'react';
import { RIGHTS_AND_DUTIES_CATALOG } from '../data/inductionContent';
import { RightDutyItem, RightDutyType } from '../types/induction';
import { Search, Scale, ShieldAlert, CheckCircle, AlertTriangle, HelpCircle, ChevronRight, X } from 'lucide-react';

export const RightsAndDutiesExplorer: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<RightDutyItem | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    return RIGHTS_AND_DUTIES_CATALOG.filter((item) => {
      const matchesType =
        selectedType === 'all' ||
        (selectedType === '2026' ? item.isUpdate2026 : item.type === selectedType);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.articleRef.toLowerCase().includes(q) ||
        item.practicalExample.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  const quickScenarios = [
    {
      question: '¿Qué exige la normatividad vigente (Ley 789 de 2002 y Dec. 1072 de 2015) a las empresas para la etapa productiva?',
      answer: 'Exige la designación obligatoria de un tutor empresarial, la concertación formal del plan formativo con el instructor del SENA y la garantía de afiliación y cobertura a ARL y Salud desde el primer día de ejecución práctica.',
      tag: 'Prácticas · Ley 789 de 2002'
    },
    {
      question: '¿Qué debo hacer si falto a clases por incapacidad médica o fuerza mayor?',
      answer: 'Debes presentar un soporte formal por escrito ante tu instructor dentro de los tres (3) días hábiles siguientes al hecho (Reglamento del Aprendiz - Acuerdo 009 de 2024, Art. 8º, Numeral 3). Si dejas pasar más tiempo o acumulas 3 días continuos sin justificar, se puede configurar deserción con cancelación de matrícula.',
      tag: 'Deber · Asistencia'
    },
    {
      question: '¿Cuál es el rol del Comité de Evaluación y Seguimiento según el Acuerdo 009 de 2024 (Art. 48)?',
      answer: 'Es un órgano colegiado paritario con presencia obligatoria del vocero de aprendices. Su principio rector es estrictamente pedagógico y formativo, obligando a formular y agotar planes de mejoramiento antes de considerar cualquier sanción disciplinaria.',
      tag: 'Debido Proceso · Art. 48'
    },
    {
      question: '¿Puedo ingresar a las instalaciones del SENA sin mi carné?',
      answer: 'No. El porte del carné en lugar visible es un deber obligatorio de seguridad (Acuerdo 009 de 2024, Art. 8º, Numeral 1). En caso de pérdida, debes denunciar la pérdida y solicitar duplicado ante la coordinación de administración educativa presentando el denuncio.',
      tag: 'Seguridad · Identificación'
    },
    {
      question: '¿Cómo se regula el uso de tecnologías e Inteligencia Artificial en las evidencias de aprendizaje?',
      answer: 'Los aprendices pueden apoyarse en herramientas tecnológicas siempre que declaren su uso de manera explícita y transparente. Copiar o generar contenidos íntegros sin análisis propio ni citación de fuentes constituye falta a la integridad académica por plagio (Acuerdo 009 de 2024, Art. 9º).',
      tag: 'Ética Digital · Directriz SENA'
    }
  ];

  const getTypeStyle = (type: RightDutyType) => {
    switch (type) {
      case 'derecho':
        return {
          label: 'Derecho del Aprendiz',
          icon: CheckCircle,
          colorText: 'text-emerald-700 dark:text-emerald-400',
          bgBorder: 'border-l-4 border-l-emerald-500'
        };
      case 'deber':
        return {
          label: 'Deber del Aprendiz',
          icon: Scale,
          colorText: 'text-blue-700 dark:text-blue-400',
          bgBorder: 'border-l-4 border-l-blue-500'
        };
      case 'prohibicion':
        return {
          label: 'Prohibición Expresa',
          icon: ShieldAlert,
          colorText: 'text-rose-700 dark:text-rose-400',
          bgBorder: 'border-l-4 border-l-rose-500'
        };
      case 'falta':
        return {
          label: 'Causal de Falta',
          icon: AlertTriangle,
          colorText: 'text-amber-700 dark:text-amber-400',
          bgBorder: 'border-l-4 border-l-amber-500'
        };
      case 'medida_formativa':
        return {
          label: 'Medida Formativa',
          icon: HelpCircle,
          colorText: 'text-purple-700 dark:text-purple-400',
          bgBorder: 'border-l-4 border-l-purple-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
            <span>Marco Normativo</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz SENA (Acuerdo 009 de 2024 - Vigente)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Guía Interactiva de Derechos, Deberes y Convivencia
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Explora las normas institucionales que garantizan tu formación profesional integral con dignidad, orden y respeto mutuo. Consulta qué hacer ante cualquier situación disciplinaria o formativa.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por norma, palabra clave (ej. inasistencia, carné, plagio, comité)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] dark:focus:ring-[#4cd900] focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({RIGHTS_AND_DUTIES_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedType('2026')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                selectedType === '2026'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
              }`}
            >
              ★ Normativa Vigente
            </button>
            <button
              onClick={() => setSelectedType('derecho')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'derecho'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Derechos
            </button>
            <button
              onClick={() => setSelectedType('deber')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'deber'
                  ? 'bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Deberes
            </button>
            <button
              onClick={() => setSelectedType('prohibicion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'prohibicion'
                  ? 'bg-white dark:bg-slate-700 text-rose-800 dark:text-rose-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Prohibiciones
            </button>
            <button
              onClick={() => setSelectedType('falta')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedType === 'falta'
                  ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Faltas
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Rights & Duties Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const typeStyle = getTypeStyle(item.type);
          const Icon = typeStyle.icon;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${typeStyle.bgBorder}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className={`font-semibold ${typeStyle.colorText} flex items-center gap-1.5`}>
                    <Icon className="w-3.5 h-3.5" />
                    {typeStyle.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.isUpdate2026 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                        Vigente
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">{item.articleRef}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#39A900] dark:group-hover:text-[#4cd900]">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-medium">
                  {item.category}
                </span>
                <span className="text-xs font-medium text-[#39A900] dark:text-[#4cd900] flex items-center gap-0.5">
                  Ver detalle
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">No se encontraron artículos que coincidan con la búsqueda "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
            }}
            className="mt-3 px-4 py-2 text-xs font-medium text-[#39A900] dark:text-[#4cd900] bg-emerald-50 dark:bg-emerald-950/60 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {/* Interactive Casuística: ¿Qué debo hacer si...? */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 dark:border-slate-800">
        <div className="max-w-2xl mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
            <span>Resolución de Casos Cotidianos</span>
            <span aria-hidden="true">·</span>
            <span>Guía Rápida para el Aprendiz</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            ¿Cómo actuar ante situaciones frecuentes en tu proceso formativo?
          </h3>
        </div>

        <div className="space-y-3">
          {quickScenarios.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 dark:bg-slate-900/80 rounded-xl border border-slate-700/80 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-[#39A900] dark:text-[#4cd900] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      {item.question}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0 hidden sm:inline">
                    {item.tag}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-700/50 dark:border-slate-800">
                    <p className="bg-slate-900/60 dark:bg-slate-950/60 p-3 rounded-lg border-l-2 border-l-[#39A900] dark:border-l-[#4cd900]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal for Selected Article */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-600">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#39A900] dark:text-[#4cd900]" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {selectedItem.articleRef}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#39A900] dark:text-[#4cd900] block mb-1">
                  {selectedItem.type.toUpperCase()} · {selectedItem.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedItem.description}
              </div>

              <div className="space-y-3">
                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide mb-1">
                    Ejemplo en la Práctica
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    {selectedItem.practicalExample}
                  </p>
                </div>

                <div className="bg-blue-50/80 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide mb-1">
                    Impacto Institucional / Consecuencia
                  </h4>
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    {selectedItem.consequenceOrBenefit}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-lg transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
