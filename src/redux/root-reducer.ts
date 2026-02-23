import { combineReducers } from "redux";
import examReducer from "./slices/exam";
import contestReducer from "./slices/contest";

// slices for common npm modules

const rootReducer = combineReducers({
  exam: examReducer,
  contest: contestReducer,
});

export default rootReducer;
