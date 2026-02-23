import { Exam, ExamState } from "@/types/exam";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { baseApi } from "@/config";
import { apiPaths } from "@/api-paths";

const initialState: ExamState = {
  edittingExam: null,
  loading: false,
  allExam: [],
};

export const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    handleRequest: (state) => {
      state.loading = true;
    },
    handleFailure: (state) => {
      state.loading = false;
    },

    setEdittingExam: (state, action: PayloadAction<Exam | null>) => {
      state.edittingExam = action.payload;
    },

    updateEdittingExam: (state, action: PayloadAction<Exam>) => {
      state.edittingExam = action.payload;
    },

    getAllExamSuccess: (state, action: PayloadAction<Exam[]>) => {
      state.loading = false;
      state.allExam = action.payload;
    },

    getExamByIdSuccess: (state, action: PayloadAction<Exam>) => {
      state.loading = false;
      state.edittingExam = action.payload;
    },

    createExamSuccess: (state, action: PayloadAction<Exam>) => {
      state.loading = false;
    },

    updateExamSuccess: (state, action: PayloadAction<Exam>) => {
      state.loading = false;
    },

    deleteExamSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.allExam = state.allExam.filter((e) => e._id !== action.payload);
    },
  },
});

const handleFailureAlert = (error: any) => {
  alert(error?.response?.data?.message || "Something went wrong");
};

export const getAllExam = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(examSlice.actions.handleRequest());

      const response = await axios.get<Exam[]>(
        `${baseApi}${apiPaths.exam.getAll}`,
      );

      dispatch(examSlice.actions.getAllExamSuccess(response.data));
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const getExamById = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(examSlice.actions.handleRequest());

      const response = await axios.get<Exam>(
        `${baseApi}${apiPaths.exam.getById}/${id}`,
      );

      dispatch(examSlice.actions.getExamByIdSuccess(response.data));
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const createExam = (data: Partial<Exam>) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(examSlice.actions.handleRequest());

      const response = await axios.post<Exam>(
        `${baseApi}${apiPaths.exam.create}`,
        data,
      );

      await dispatch(getAllExam());
      dispatch(examSlice.actions.createExamSuccess(response.data));
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const updateExam = (id: string, data: Exam) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(examSlice.actions.handleRequest());

      const response = await axios.post<Exam>(
        `${baseApi}${apiPaths.exam.update}/${id}`,
        data,
      );

      dispatch(examSlice.actions.updateExamSuccess(response.data));
      dispatch(getExamById(id));
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const deleteExam = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(examSlice.actions.handleRequest());

      await axios.delete(`${baseApi}${apiPaths.exam.delete}/${id}`);

      dispatch(examSlice.actions.deleteExamSuccess(id));
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const createContest = (examId: string, contestName: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.post(`${baseApi}${apiPaths.contest.create}`, {
        contestStructureId: examId,
        name: contestName,
      });
    } catch (error: any) {
      dispatch(examSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const { setEdittingExam, updateEdittingExam } = examSlice.actions;

export default examSlice.reducer;
