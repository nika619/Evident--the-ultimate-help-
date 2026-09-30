/**
 * Evident Interview Store
 * Manages active architectural defense questions, candidate responses,
 * trade-off evaluations, and referenced code citations.
 */

import { create } from 'zustand';
import { DefenseQuestion, DefenseEvaluation } from '../domain/types';
import { InterviewService } from '../services/interviewService';
import { useEvidenceStore } from './useEvidenceStore';

interface InterviewState {
  questions: DefenseQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  evaluations: Record<string, DefenseEvaluation>;
  isEvaluating: boolean;

  // Actions
  initialize: () => void;
  setAnswer: (questionId: string, answer: string) => void;
  evaluateCurrentQuestion: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  evaluations: {},
  isEvaluating: false,

  initialize: () => {
    const { projects, evidence } = useEvidenceStore.getState();
    const questions = InterviewService.generateQuestions(projects, evidence);
    set({
      questions,
      currentQuestionIndex: 0,
    });
  },

  setAnswer: (questionId, answer) => {
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: answer },
    }));
  },

  evaluateCurrentQuestion: () => {
    const { questions, currentQuestionIndex, userAnswers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const answer = userAnswers[currentQuestion.id] || '';
    set({ isEvaluating: true });

    const evaluation = InterviewService.evaluateAnswer(currentQuestion, answer);

    set((state) => ({
      evaluations: { ...state.evaluations, [currentQuestion.id]: evaluation },
      isEvaluating: false,
    }));
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  resetSession: () => {
    set({
      userAnswers: {},
      evaluations: {},
      currentQuestionIndex: 0,
    });
  },
}));
