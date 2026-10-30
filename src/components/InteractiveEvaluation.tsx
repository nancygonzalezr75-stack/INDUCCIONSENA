import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVALUATION_QUESTIONS } from '../data/inductionContent';
import { EvaluationQuestion, EvaluationResult, ApprenticeProfile } from '../types/induction';
import { CheckCircle2, XCircle, AlertCircle, Award, RotateCcw, ArrowRight, ArrowLeft, Clock, FileCheck, BookOpen } from 'lucide-react';

interface InteractiveEvaluationProps {
  apprentice: ApprenticeProfile;
  onSaveResult: (result: EvaluationResult) => void;
  onViewCertificate: () => void;
  onNavigateToModules: () => void;
  savedResult?: EvaluationResult | null;
}

export const InteractiveEvaluation: React.FC<InteractiveEvaluationProps> = ({
  apprentice,
  onSaveResult,
  onViewCertificate,
  onNavigateToModules,
  savedResult
}) => {
  const [questions] = useState<EvaluationQuestion[]>(EVALUATION_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(!!savedResult);
  const [result, setResult] = useState<EvaluationResult | null>(savedResult || null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(!savedResult);

  useEffect(() => {
    if (savedResult) {
      setResult(savedResult);
      setIsSubmitted(true);
      setUserAnswers(savedResult.userAnswers || {});
      setIsTimerActive(false);
    }
  }, [savedResult]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && !isSubmitted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isSubmitted]);

  const currentQuestion = questions[currentIdx];
  const selectedAnswer = userAnswers[currentQuestion.id];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleSubmitEvaluation = () => {
    setIsTimerActive(false);

    let correctCount = 0;
    const catScores: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      if (!catScores[q.category]) {
        catScores[q.category] = { total: 0, correct: 0 };
      }
      catScores[q.category].total += 1;

      const userAns = userAnswers[q.id];
      if (userAns === q.correctIndex) {
        correctCount += 1;
        catScores[q.category].correct += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;

    const evalResult: EvaluationResult = {
      id: `eval-${Date.now()}`,
      apprenticeId: apprentice.id,
      apprenticeName: apprentice.fullName,
      documentNumber: apprentice.documentNumber,
      ficha: apprentice.ficha,
      completedAt: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      score,
      totalQuestions: questions.length,
      correctAnswersCount: correctCount,
      passed,
      categoryScores: catScores,
      userAnswers,
      certificateCode: `SENA-IND-${apprentice.ficha}-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setResult(evalResult);
    setIsSubmitted(true);
    onSaveResult(evalResult);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#15803d', '#ffffff', '#ca8a04']
        });
      } catch {
        // Safe confetti fallback
      }
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setResult(null);
    setCurrentIdx(0);
    setSecondsElapsed(0);
    setIsTimerActive(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider mb-1">
              <span>Evaluación de Conocimientos</span>
              <span aria-hidden="true">·</span>
              <span>Medición de Apropiación del Proceso de Inducción</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Evaluación Oficial de Apropiación SENA
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Identifica tu nivel de asimilación de los derechos, deberes, valores e imagen institucional. Se aprueba con un puntaje mínimo del <strong>80%</strong>.
            </p>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-mono text-slate-900 dark:text-white font-bold">{formatTime(secondsElapsed)}</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Respondidas: <strong className="text-slate-900 dark:text-white">{answeredCount}/{questions.length}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isSubmitted && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              <span>Progreso de la prueba</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#39A900] dark:bg-[#4cd900] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* RESULTS SCREEN (When Submitted) */}
      {isSubmitted && result && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-6 md:p-8 border shadow-xs transition-colors ${
              result.passed
                ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    result.passed ? 'bg-[#39A900] text-white shadow-md' : 'bg-amber-600 text-white shadow-md'
                  }`}
                >
                  {result.passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                    <span className={result.passed ? 'text-[#39A900] dark:text-[#4cd900]' : 'text-amber-700 dark:text-amber-400'}>
                      {result.passed ? 'Apropiación Exitosa · Competente' : 'Apropiación en Proceso · Refuerzo Requerido'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {result.passed
                      ? `¡Felicitaciones, ${apprentice.fullName}! Has Aprobado la Inducción`
                      : `Buen intento, ${apprentice.fullName}. Requieres repasar algunos temas`}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {result.passed
                      ? 'Demostraste una sólida comprensión de tus derechos, deberes, principios éticos y la estructura institucional del SENA. Tu constancia oficial de inducción ha sido expedida y está lista.'
                      : 'El umbral mínimo de aprobación institucional es del 80%. Revisa la retroalimentación detallada abajo, repasa los módulos recomendados e inténtalo nuevamente.'}
                  </p>
                </div>
              </div>

              {/* Score Display Card */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shrink-0 min-w-44 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Puntaje Obtenido
                </span>
                <div className={`text-4xl font-extrabold my-1 ${result.passed ? 'text-[#39A900] dark:text-[#4cd900]' : 'text-amber-600 dark:text-amber-400'}`}>
                  {result.score}%
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300 block">
                  {result.correctAnswersCount} de {result.totalQuestions} correctas
                </span>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Apropiación por Áreas Temáticas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(result.categoryScores).map(([cat, data]) => {
                  const percent = Math.round((data.correct / data.total) * 100);
                  const isCatPassed = percent >= 80;
                  return (
                    <div key={cat} className="bg-white dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        <span className="truncate">{cat}</span>
                        <span className={isCatPassed ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold'}>
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${isCatPassed ? 'bg-[#39A900] dark:bg-[#4cd900]' : 'bg-amber-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {data.correct} de {data.total} correctas
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRetake}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Repetir Evaluación
              </button>

              <div className="flex items-center gap-2">
                {!result.passed && (
                  <button
                    onClick={onNavigateToModules}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Repasar Módulos
                  </button>
                )}
                {result.passed && (
                  <button
                    onClick={onViewCertificate}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Award className="w-4 h-4" />
                    Ver y Descargar Constancia Oficial
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Revisión Detallada de Respuestas y Fundamentación Normativa
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                10 preguntas evaluadas
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = result.userAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-[#4cd900] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Pregunta {idx + 1}: {q.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {q.reglamentoCitation}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 italic">
                      "{q.scenario}"
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      {q.question}
                    </h4>

                    {/* Options status */}
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        const isTheCorrectOne = optIdx === q.correctIndex;

                        let style = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                        if (isTheCorrectOne) {
                          style = 'bg-emerald-100/70 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-medium';
                        } else if (isChosen && !isTheCorrectOne) {
                          style = 'bg-rose-100/70 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${style}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-mono text-[11px] font-bold">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt.text}</span>
                            </div>
                            {isTheCorrectOne && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 shrink-0">
                                Correcta
                              </span>
                            )}
                            {isChosen && !isTheCorrectOne && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 shrink-0">
                                Tu respuesta
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rationale explanation */}
                    <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-100 block mb-0.5">Explicación pedagógica:</strong>
                      {q.options[q.correctIndex].rationale}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE EVALUATION MODE */}
      {!isSubmitted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question navigator chips on the left */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Preguntas de la Prueba
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = userAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#39A900] dark:bg-[#4cd900] text-white ring-2 ring-emerald-300 dark:ring-emerald-700 scale-105'
                        : isAnswered
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39A900] dark:bg-[#4cd900]" />
                <span>Pregunta actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 dark:bg-emerald-600" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span>Pendiente</span>
              </div>
            </div>

            {answeredCount === questions.length && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleSubmitEvaluation}
                  className="w-full py-2.5 px-4 bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  Finalizar y Calificar
                </button>
              </div>
            )}
          </div>

          {/* Active Question Box */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] dark:text-[#4cd900] uppercase tracking-wider">
                <span>Pregunta {currentIdx + 1} de {questions.length}</span>
                <span aria-hidden="true">·</span>
                <span>{currentQuestion.category}</span>
                {currentQuestion.isUpdate2026 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    Acuerdo 009 de 2024
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {currentQuestion.reglamentoCitation}
              </span>
            </div>

            {/* Scenario */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Situación o Caso Real:
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                "{currentQuestion.scenario}"
              </p>
            </div>

            {/* Question Title */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/60 border-[#39A900] dark:border-[#4cd900] ring-1 ring-[#39A900] dark:ring-[#4cd900] shadow-xs'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#39A900] dark:bg-[#4cd900] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <div className="flex-1 text-xs text-slate-800 dark:text-slate-200 leading-relaxed pt-0.5">
                      {opt.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Anterior
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 border border-transparent dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    Siguiente
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitEvaluation}
                    disabled={answeredCount < questions.length}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d7a04] dark:bg-[#39A900] dark:hover:bg-[#4cd900] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    Finalizar Evaluación ({answeredCount}/{questions.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
