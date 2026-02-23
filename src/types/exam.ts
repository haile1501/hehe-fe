import { QuestionType } from "./question";

export type Exam = {
  _id: string;
  name: string;
  imgSrc: string;
  round1: { questions: QuestionType[] };
  round2: { questions: QuestionType[] };
  round3: { questions: QuestionType[] };
};

export type ExamState = {
  edittingExam: Exam | null;
  loading: boolean;
  allExam: Exam[];
};
