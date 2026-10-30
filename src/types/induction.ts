export type Role = 'learner' | 'instructor' | 'bienestar';

export interface ApprenticeProfile {
  id: string;
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP';
  documentNumber: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  gender?: string;
  populationType?: string;
  ficha: string;
  programName: string;
  regional: string;
  trainingCenter: string;
  inductionStartDate: string;
  status: 'en_induccion' | 'aprobado' | 'requiere_refuerzo';
  evaluationScore?: number;
  evaluationCompletedAt?: string;
  completedModules: string[];
  hasSignedPact2026?: boolean;
  pactSignedAt?: string;
}

export interface InductionTopic {
  id: string;
  title: string;
  summary: string;
  content: string[];
  keyPoints: string[];
  legalReference?: string;
  badgeText?: string;
  isUpdate2026?: boolean;
}

export interface InductionModule {
  id: string;
  order: number;
  title: string;
  shortDescription: string;
  estimatedMinutes: number;
  category: 'identidad' | 'reglamento' | 'ruta' | 'bienestar' | 'tecnologia';
  icon: string;
  topics: InductionTopic[];
  badgeText?: string;
}

export type RightDutyType = 'derecho' | 'deber' | 'prohibicion' | 'falta' | 'medida_formativa';

export interface RightDutyItem {
  id: string;
  type: RightDutyType;
  title: string;
  description: string;
  articleRef: string;
  category: 'Academico' | 'Disciplinario' | 'Institucional' | 'Etapa Productiva' | 'Seguridad';
  practicalExample: string;
  consequenceOrBenefit: string;
  isUpdate2026?: boolean;
}

export interface QuestionOption {
  text: string;
  rationale: string;
}

export interface EvaluationQuestion {
  id: string;
  moduleId: string;
  category: string;
  scenario: string;
  question: string;
  options: QuestionOption[];
  correctIndex: number;
  reglamentoCitation: string;
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  isUpdate2026?: boolean;
}

export interface EvaluationResult {
  id: string;
  apprenticeId: string;
  apprenticeName: string;
  documentNumber: string;
  ficha: string;
  completedAt: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctAnswersCount: number;
  passed: boolean; // >= 80
  categoryScores: Record<string, { total: number; correct: number }>;
  userAnswers: Record<string, number>;
  certificateCode?: string;
}

export interface CohortLearner {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  ficha: string;
  programName: string;
  regional: string;
  trainingCenter: string;
  status: 'en_induccion' | 'aprobado' | 'requiere_refuerzo';
  progressPercentage: number;
  evaluationScore?: number;
  evaluationDate?: string;
  completedModulesCount?: number;
  hasSignedPact2026?: boolean;
  pactSignedAt?: string;
  phone?: string;
  city?: string;
  address?: string;
  gender?: string;
  populationType?: string;
}
