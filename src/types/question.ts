export type QuestionType = {
  question: string;
  choices: ChoiceType[];
  correctAnswer?: Choice;
  time?: number;
  startedDate?: number;
  teamAnswers: {
    teamName: string;
    answerLabel: string;
  }[];
};

type Choice = string;

export type ChoiceType = {
  label: Choice;
  text: string;
};
