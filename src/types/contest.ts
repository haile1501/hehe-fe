import { QuestionType } from "./question";

export type Contest = {
  _id: string;
  name: string;
  code: string;
  imgSrc: string;
  round1: { questions: QuestionType[]; currentQuestion: number };
  round2: { questions: QuestionType[]; currentQuestion: number };
  round3: { questions: QuestionType[]; currentQuestion: number };
  teams: Team[];
  currentRound: number;
  currentRound3Question: number;
  isStarted: boolean;
  currentState: string;
};

export type Team = {
  name: string;
  password: string;
  totalScore: number;
};

export type ContestState = {
  allContest: Contest[];
  loading: boolean;
  contestDetail: Contest | null;
};
