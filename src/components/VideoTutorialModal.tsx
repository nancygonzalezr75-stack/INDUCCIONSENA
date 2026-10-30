import React, { useRef, useEffect } from 'react';
import { X, Play, RotateCcw, Volume2, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
  videoSrc = '/assets/aistudio/2026__11_51_9d3cf5f7.mp4'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video and cleanup when closing
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    } else if (isOpen && videoRef.current) {
      // Optional smooth auto-play attempt with user gesture
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented playback, controls will allow manual click
        });
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b-2 border-[#39A900]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shadow-md shadow-[#39A900]/30 shrink-0">
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="video-modal-title" className="font-bold text-sm sm:text-base text-white">
                  Video Tutorial: Boot Camp de Inducción Institucional
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#39A900]/30 text-[#4cd900] border border-[#39A900]/50 px-2 py-0.5 rounded-full">
                  Tutorial Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Guía audiovisual paso a paso · Navegación, Reglamento y Constancia Oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
            aria-label="Cerrar video tutorial"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="bg-black relative flex items-center justify-center overflow-hidden flex-1">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            playsInline
            preload="auto"
            className="w-full max-h-[62vh] aspect-video object-contain bg-black"
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>

        {/* Quick Chapters / Seeker & Instructions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#39A900]" />
              Capítulos del Video Tutorial:
            </span>
            <button
              onClick={handleRestart}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#39A900] dark:hover:text-[#4cd900] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar video</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleSeek(0)}
              className="p-2 text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#39A900] transition-all"
            >
              <span className="font-bold text-[#39A900] block text-[11px]">00:00</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">Introducción</span>
            </button>
            <button
              onClick={() => handleSeek(26)}
              className="p-2 text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#39A900] transition-all"
            >
              <span className="font-bold text-[#39A900] block text-[11px]">00:26</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">Ficha y Registro</span>
            </button>
            <button
              onClick={() => handleSeek(50)}
              className="p-2 text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#39A900] transition-all"
            >
              <span className="font-bold text-[#39A900] block text-[11px]">00:50</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">Módulos Formativos</span>
            </button>
            <button
              onClick={() => handleSeek(135)}
              className="p-2 text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#39A900] transition-all"
            >
              <span className="font-bold text-[#39A900] block text-[11px]">02:15</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate block">Evaluación y QR</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:block">
              Usa los controles del reproductor para cambiar la velocidad, volumen o pantalla completa.
            </p>
            <button
              onClick={onClose}
              className="ml-auto px-5 py-2 bg-[#39A900] hover:bg-[#2d7a04] text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Entendido, Continuar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
