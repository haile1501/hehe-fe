import { QuestionType } from "./question";

export type QuestionSet = {
  id: string;
  subject: string;
  name: string;
  numOfQuestion: number;
  playCount: number;
  questions: QuestionType[];
};
