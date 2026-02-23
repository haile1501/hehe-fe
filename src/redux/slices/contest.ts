import { Contest, ContestState, Team } from "@/types/contest";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import axios from "axios";
import { baseApi } from "@/config";
import { apiPaths } from "@/api-paths";

const initialState: ContestState = {
  allContest: [],
  loading: false,
  contestDetail: null,
};

export const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    handleRequest: (state) => {
      state.loading = true;
    },
    handleFailure: (state) => {
      state.loading = false;
    },
    handleGetAllContest: (state, action: PayloadAction<Contest[]>) => {
      state.loading = false;
      state.allContest = action.payload;
    },
    getContestDetail: (state, action: PayloadAction<Contest | null>) => {
      state.loading = false;
      state.contestDetail = action.payload;
    },
  },
});

const handleFailureAlert = (error: any) => {
  alert(error?.response?.data?.message || "Something went wrong");
};

export const getAllContest = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(contestSlice.actions.handleRequest());

      const response = await axios.get<Contest[]>(
        `${baseApi}${apiPaths.contest.getAll}`,
      );

      dispatch(contestSlice.actions.handleGetAllContest(response.data));
    } catch (error: any) {
      dispatch(contestSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const getContestById = (id: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(contestSlice.actions.handleRequest());

      const response = await axios.get<Contest | null>(
        `${baseApi}${apiPaths.contest.getById}/${id}`,
      );

      dispatch(contestSlice.actions.getContestDetail(response.data));
    } catch (error: any) {
      dispatch(contestSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export const updateTeams = (contestId: string, teams: Partial<Team>[]) => {
  return async (dispatch: AppDispatch) => {
    try {
      await axios.post<Contest | null>(
        `${baseApi}/contest/admin/${contestId}/teams`,
        { teams },
      );

      await dispatch(getContestById(contestId));
    } catch (error: any) {
      dispatch(contestSlice.actions.handleFailure());
      handleFailureAlert(error);
    }
  };
};

export default contestSlice.reducer;
