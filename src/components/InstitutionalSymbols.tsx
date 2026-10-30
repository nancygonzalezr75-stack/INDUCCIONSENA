import React, { useState, useEffect, useRef } from 'react';
import { SenaLogo } from './SenaLogo';
import { Shield, Flag, User, Music, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const InstitutionalSymbols: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'escudo' | 'bandera' | 'logo' | 'himno' | 'valores'>('escudo');
  const [selectedShieldSector, setSelectedShieldSector] = useState<'primario' | 'secundario' | 'terciario'>('primario');
  const [isPlayingHymn, setIsPlayingHymn] = useState(false);
  const [hymnProgress, setHymnProgress] = useState(0);
  const [activeStanza, setActiveStanza] = useState(0);
  const timerRef = useRef<any>(null);

  // Audio tone simulation using Web Audio API for an authentic musical chime experience
  const audioCtxRef = useRef<AudioContext | null>(null);

  const hymnStanzas = [
    {
      title: 'Coro',
      text: [
        'Estudiantes del SENA adelante',
        'por Colombia luchad con amor',
        'con el ánimo noble y radiante',
        'transformémosle el mundo en mejor.'
      ]
    },
    {
      title: 'Estrofa I',
      text: [
        'De la patria el futuro destino,',
        'en las manos del joven está,',
        'el trabajo es seguro camino,',
        'que el progreso a Colombia dará.'
      ]
    },
    {
      title: 'Estrofa II',
      text: [
        'En la forja del SENA se forman,',
        'hombres libres que saben triunfar,',
        'adelante con fuerza y coraje,',
        'que la patria nos llama a luchar.'
      ]
    },
    {
      title: 'Estrofa III',
      text: [
        'Hoy la patria nos grita ¡adelante!',
        'con orgullo y con fe militar,',
        'es el SENA bastión gigante,',
        'donde aprendes a amar y crear.'
      ]
    }
  ];

  useEffect(() => {
    if (isPlayingHymn) {
      timerRef.current = setInterval(() => {
        setHymnProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingHymn(false);
            return 0;
          }
          const next = prev + 2;
          const stanzaIdx = Math.floor((next / 100) * hymnStanzas.length);
          setActiveStanza(Math.min(stanzaIdx, hymnStanzas.length - 1));
          return next;
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingHymn]);

  const togglePlayHymn = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current && !isPlayingHymn) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(523.25, audioCtxRef.current.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.45);
      }
    } catch {
      // Audio context might be restricted, fallback quietly
    }
    setIsPlayingHymn(!isPlayingHymn);
  };

  const restartHymn = () => {
    setHymnProgress(0);
    setActiveStanza(0);
    setIsPlayingHymn(true);
  };

  return (
    <div className="space-y-6">
      {/* Header intro */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
              <span>Identidad Institucional</span>
              <span aria-hidden="true">·</span>
              <span>Símbolos y Valores SENA</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Símbolos que Forjan el Orgullo de Ser Aprendiz
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Cada emblema del Servicio Nacional de Aprendizaje encarna el compromiso con el desarrollo social, técnico y económico de Colombia.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('escudo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'escudo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Escudo
            </button>
            <button
              onClick={() => setActiveTab('bandera')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bandera'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Bandera
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'logo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Logo-Símbolo
            </button>
            <button
              onClick={() => setActiveTab('himno')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'himno'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Himno Oficial
            </button>
            <button
              onClick={() => setActiveTab('valores')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'valores'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#39A900] dark:text-[#4cd900]" />
              Valores Éticos
            </button>
          </div>
        </div>
      </div>

      {/* TAB CONTENT: ESCUDO */}
      {activeTab === 'escudo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center transition-colors">
            {/* Shield Image */}
            <div className="relative w-80 h-80 max-w-full flex items-center justify-center my-2 p-2">
              <img
                src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                alt="Escudo Oficial del SENA"
                className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/escudo-sena.png';
                }}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Haz clic en cualquier sector del escudo para explorar su significado heráldico.
            </p>

            <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedShieldSector('primario')}
                className={`p-2 rounded-xl text-left transition-all ${
                  selectedShieldSector === 'primario'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">1. Primario</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Agropecuario</div>
              </button>
              <button
                onClick={() => setSelectedShieldSector('secundario')}
                className={`p-2 rounded-xl text-left transition-all ${
                  selectedShieldSector === 'secundario'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">2. Secundario</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Industria</div>
              </button>
              <button
                onClick={() => setSelectedShieldSector('terciario')}
                className={`p-2 rounded-xl text-left transition-all ${
                  selectedShieldSector === 'terciario'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-900 dark:text-white">3. Terciario</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Servicios</div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-2">
                <span>Sector Seleccionado</span>
                <span aria-hidden="true">·</span>
                <span>
                  {selectedShieldSector === 'primario' && 'Sector Primario y Extractivo'}
                  {selectedShieldSector === 'secundario' && 'Sector Secundario e Industria'}
                  {selectedShieldSector === 'terciario' && 'Sector Terciario, Comercio y Servicios'}
                </span>
              </div>

              {selectedShieldSector === 'primario' && (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    El Café y las Espigas: El Campo y la Tierra Colombiana
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ubicado en el cuartel superior izquierdo, está representado por una rama de café y espigas doradas. Simboliza el sector agropecuario, forestal, pesquero y extractivo, base ancestral de la soberanía alimentaria colombiana.
                  </p>
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide mb-1">
                      Misión en la Formación
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Capacitar a campesinos, mayordomos, tecnólogos en producción agrícola, biotecnología y gestión de recursos naturales mediante el programa SENA Emprende Rural (SER) y centros agropecuarios en todo el territorio nacional.
                    </p>
                  </div>
                </div>
              )}

              {selectedShieldSector === 'secundario' && (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    La Rueda Dentada: La Fuerza Industrial y de Fabricación
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ubicada en el cuartel superior derecho, representa la fuerza fabril, metalmecánica, química, de construcción y manufactura. La rueda dentada o engranaje es el motor del desarrollo tecnológico que transforma la materia prima en bienes con valor agregado.
                  </p>
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide mb-1">
                      Misión en la Formación
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Formar técnicos y tecnólogos en mecatrónica, soldadura, automatización, diseño industrial, construcción y energías renovables con altos estándares de calidad internacional.
                    </p>
                  </div>
                </div>
              )}

              {selectedShieldSector === 'terciario' && (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    El Caduceo: El Comercio, la Tecnología y los Servicios
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ubicado en el cuartel inferior del escudo, el caduceo (vara alada con dos serpientes entrelazadas) es el símbolo universal del comercio, el intercambio económico, la comunicación, la administración y la tecnología.
                  </p>
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide mb-1">
                      Misión en la Formación
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Preparar talento humano para el desarrollo de software, ciberseguridad, gestión turística, salud, logística, banca, mercadeo y comercio electrónico para dinamizar la economía digital global.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 dark:bg-slate-800/90 text-white rounded-2xl p-6 border border-slate-800 dark:border-slate-700">
              <h4 className="text-sm font-bold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-2">
                Dato Clave de Evaluación
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recuerda este principio: <strong>el escudo del SENA resume los 3 grandes sectores económicos de Colombia</strong> (primario, secundario y terciario). Esta pregunta aparece con frecuencia en las evaluaciones institucionales de apropiación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BANDERA */}
      {activeTab === 'bandera' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center transition-colors">
            {/* Realistic stylized flag */}
            <div className="relative w-full max-w-sm aspect-3/2 bg-white dark:bg-slate-800/90 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100/40 via-transparent to-slate-200/30 dark:from-slate-700/20 dark:to-slate-900/40 pointer-events-none" />
              <div className="flex flex-col items-center">
                <SenaLogo className="w-28 h-28" variant="color" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
              Bandera Institucional: Blanco puro con el logo-símbolo oficial en el centro.
            </p>
          </div>

          <div className="md:col-span-6 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Significado de la Bandera del SENA
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                La bandera del SENA consta de un paño blanco de proporción rectangular con el escudo o emblema institucional ubicado de forma equilibrada en el centro.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">El Color Blanco</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Simboliza la <strong>paz, la tranquilidad, la transparencia, la armonía y la libertad</strong>, condiciones indispensables para el aprendizaje continuo y el desarrollo productivo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Presencia Institucional</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Se iza con orgullo en todos los centros de formación junto al pabellón nacional de la República de Colombia en actos de inicio de trimestre, grados y ceremonias protocolares.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LOGO-SÍMBOLO */}
      {activeTab === 'logo' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center transition-colors">
            <div className="w-80 h-80 max-w-full rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 shadow-xs">
              <img
                src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                alt="Escudo Oficial del SENA"
                className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/escudo-sena.png';
                }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
              Emblema Oficial SENA: Imagen institucional oficial de formación profesional.
            </p>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                El Ser Humano como Centro del Aprendizaje
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                El logo-símbolo muestra a un ser humano estilizado caminando hacia el horizonte con pasos decididos. Representa la evolución y transformación del aprendiz a través del conocimiento y las habilidades para la vida.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">El Camino y Horizonte</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    El sendero trazado por el esfuerzo propio y la disciplina para superar barreras socioeconómicas.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">El Verde SENA</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    El color institucional (#39A900) evoca la esperanza, la juventud, la riqueza natural y la prosperidad colombiana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HIMNO */}
      {activeTab === 'himno' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
                <span>Composición Oficial</span>
                <span aria-hidden="true">·</span>
                <span>Letra: Luis Alfredo Sánchez / Música: Daniel Marlez</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Himno Institucional del SENA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Entona el himno para interiorizar el espíritu de superación y amor patrio.
              </p>
            </div>

            {/* Audio player controls */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={togglePlayHymn}
                className="w-10 h-10 rounded-xl bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
                title={isPlayingHymn ? 'Pausar audio' : 'Reproducir himno'}
              >
                {isPlayingHymn ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={restartHymn}
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="w-36 hidden sm:block">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-mono">
                  <span>{isPlayingHymn ? 'Sonando...' : 'Pausado'}</span>
                  <span>{Math.round(hymnProgress)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#39A900] dark:bg-[#4cd900] h-full transition-all duration-300"
                    style={{ width: `${hymnProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stanzas Display with Active Stanza Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hymnStanzas.map((stanza, idx) => (
              <div
                key={stanza.title}
                className={`p-4 rounded-xl border transition-all ${
                  idx === activeStanza && isPlayingHymn
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-[#39A900] dark:border-[#4cd900] shadow-sm scale-102 ring-1 ring-[#39A900]'
                    : idx === 0
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    idx === activeStanza && isPlayingHymn ? 'text-[#39A900] dark:text-[#4cd900]' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {stanza.title}
                  </span>
                  {idx === activeStanza && isPlayingHymn && (
                    <span className="w-2 h-2 rounded-full bg-[#39A900] dark:bg-[#4cd900] animate-ping" />
                  )}
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">
                  {stanza.text.map((line, lIdx) => (
                    <p key={lIdx} className={idx === 0 ? 'font-semibold text-slate-800 dark:text-slate-100' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: VALORES ÉTICOS */}
      {activeTab === 'valores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Respeto',
              desc: 'Reconocimiento del valor supremo de la dignidad humana y los derechos de cada miembro de la comunidad educativa.',
              scenario: 'Escuchar opiniones diversas en foros y talleres sin burlas ni descalificaciones.'
            },
            {
              title: 'Honestidad',
              desc: 'Actuar con coherencia, transparencia y rectitud en evaluaciones, entrega de evidencias y relaciones laborales.',
              scenario: 'Citar siempre las fuentes y rechazar rotundamente el plagio académico o la suplantación.'
            },
            {
              title: 'Solidaridad',
              desc: 'Compromiso mutuo con las necesidades de los compañeros y la comunidad, promoviendo el trabajo colaborativo.',
              scenario: 'Apoyar a compañeros que presentan dificultades en actividades técnicas o de laboratorio.'
            },
            {
              title: 'Liderazgo',
              desc: 'Capacidad de inspirar, proponer soluciones innovadoras y asumir la vocería activa con responsabilidad social.',
              scenario: 'Postularse a vocero de ficha o proponer iniciativas de mejora para el centro de formación.'
            },
            {
              title: 'Justicia y Equidad',
              desc: 'Trato imparcial, garantizando igualdad de oportunidades sin discriminación de género, etnia o condición social.',
              scenario: 'Distribución justa de tareas en proyectos de formación e inclusión de todos los integrantes.'
            },
            {
              title: 'Libre Pensamiento',
              desc: 'Actitud crítica y constructiva orientada a la investigación, la innovación y la transformación productiva.',
              scenario: 'Cuestionar constructivamente y buscar nuevas metodologías y tecnologías para resolver problemas.'
            }
          ].map((val) => (
            <div key={val.title} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-[#4cd900]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{val.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {val.desc}
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wide">
                  En la vida del aprendiz:
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{val.scenario}"
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
