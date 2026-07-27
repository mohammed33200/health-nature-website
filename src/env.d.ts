/// <reference types="astro/client" />

interface Window {
  bi: (ar: string, en?: string) => string;
  setLang: (lang: string) => void;
  toggleLang: () => void;
  initQuiz: (config: any) => void;
  quizAnswer: (qIndex: number, optIndex: number, value: any) => void;
  startQuiz: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  renderQuestionsGlobal: () => void;
}